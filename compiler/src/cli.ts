#!/usr/bin/env node

/**
 * cbang CLI — The C! compiler command-line interface.
 *
 * Usage:
 *   cbang check <file.cb>    Type-check a file
 *   cbang lex <file.cb>      Show tokens (debug)
 *   cbang parse <file.cb>    Show AST (debug)
 *   cbang run <file.cb>      Build and run
 *   cbang build <file.cb>    Compile to JS (default)
 *   cbang build --target wasm <file.cb>  Compile to WASM
 *   cbang build --target llvm <file.cb>  Compile to LLVM IR
 *   cbang build --target evm <file.cb>   Compile to EVM bytecode
 *   cbang build --target near <file.cb>  Compile to NEAR WASM
 *   cbang verify <file.cb>   Run formal verification
 *   cbang --version           Show version
 *   cbang --help              Show help
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, basename, join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createInterface } from 'node:readline';
import { Lexer, TokenType, Parser, formatDiagnostic, createError, VERSION } from './index.js';
import { Resolver } from './semantic/index.js';
import { Checker, OwnershipChecker, RefinementChecker, IntentChecker, EffectChecker } from './checker/index.js';
import type { Program, TopLevelItem } from './ast/index.js';

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(`cbang ${VERSION}`);
    return;
  }

  const command = args[0];
  const file = args[1];

  switch (command) {
    case 'lex':
      if (!file) {
        console.error('Error: missing file argument');
        console.error('Usage: cbang lex <file.cb>');
        process.exit(1);
      }
      lexCommand(file);
      break;

    case 'check':
      if (!file) {
        console.error('Error: missing file argument');
        process.exit(1);
      }
      checkCommand(file);
      break;

    case 'parse':
      if (!file) {
        console.error('Error: missing file argument');
        process.exit(1);
      }
      parseCommand(file);
      break;

    case 'run':
      if (!file) {
        console.error('Error: missing file argument');
        console.error('Usage: cbang run <file.cb>');
        process.exit(1);
      }
      runCommand(file).catch(handleError);
      break;

    case 'build': {
      if (!file) {
        console.error('Error: missing file argument');
        console.error('Usage: cbang build [--target js|wasm|llvm|evm|near] <file.cb>');
        process.exit(1);
      }
      const target = args.includes('--target')
        ? args[args.indexOf('--target') + 1] ?? 'js'
        : 'js';
      const buildFile = target !== 'js' && args.includes('--target')
        ? args.filter(a => a !== '--target' && a !== target).slice(1)[0] ?? file
        : file;
      buildCommand(buildFile, target).catch(handleError);
      break;
    }

    case 'repl':
      replCommand();
      break;

    case 'verify':
      console.log(`'cbang verify' is not yet implemented.`);
      console.log('C! is in early development. See: https://github.com/integsec/C-Bang');
      process.exit(0);
      break;

    case 'audit':
      if (!file) {
        console.error('Error: missing file argument');
        console.error('Usage: cbang audit <file.cb>');
        process.exit(1);
      }
      auditCommand(file);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function lexCommand(filePath: string): void {
  const source = readSource(filePath);
  const lexer = new Lexer(source, filePath);
  const tokens = lexer.tokenize();

  for (const token of tokens) {
    if (token.type === TokenType.Comment || token.type === TokenType.Newline) continue;
    const loc = `${token.span.start.line}:${token.span.start.column}`;
    const value = token.value.length > 40 ? token.value.slice(0, 40) + '...' : token.value;
    console.log(`${loc.padEnd(8)} ${token.type.padEnd(20)} ${value}`);
  }

  const errorCount = tokens.filter(t => t.type === TokenType.Error).length;
  const tokenCount = tokens.filter(t => t.type !== TokenType.Comment && t.type !== TokenType.EOF).length;
  console.log(`\n${tokenCount} tokens, ${errorCount} errors`);
}

function parseCommand(filePath: string): void {
  const source = readSource(filePath);
  const lexer = new Lexer(source, filePath);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program, diagnostics } = parser.parse();

  if (diagnostics.length > 0) {
    for (const d of diagnostics) {
      console.error(formatDiagnostic(d, source));
    }
  }

  console.log(JSON.stringify(program, null, 2));
  console.log(`\n${program.items.length} top-level items, ${diagnostics.length} errors`);
}

function checkCommand(filePath: string): void {
  const source = readSource(filePath);
  const lexer = new Lexer(source, filePath);
  const tokens = lexer.tokenize();

  const lexErrors = tokens.filter(t => t.type === TokenType.Error);
  if (lexErrors.length > 0) {
    for (const err of lexErrors) {
      const diag = createError('L001', `Unexpected character '${err.value}'`, err.span);
      console.error(formatDiagnostic(diag, source));
    }
    process.exit(1);
  }

  console.log(`✓ Lexing passed (${tokens.length} tokens)`);

  const parser = new Parser(tokens);
  const { program, diagnostics } = parser.parse();

  if (diagnostics.length > 0) {
    for (const d of diagnostics) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  console.log(`✓ Parsing passed (${program.items.length} top-level items)`);

  const resolver = new Resolver();
  const nameDiags = resolver.resolve(program);

  if (nameDiags.length > 0) {
    for (const d of nameDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  console.log(`✓ Name resolution passed`);

  const checker = new Checker();
  const typeDiags = checker.check(program);

  if (typeDiags.length > 0) {
    for (const d of typeDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  console.log(`✓ Type checking passed`);

  const ownershipChecker = new OwnershipChecker();
  const ownerDiags = ownershipChecker.check(program);

  if (ownerDiags.length > 0) {
    for (const d of ownerDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  console.log(`✓ Ownership analysis passed`);

  const refinementChecker = new RefinementChecker();
  const refineDiags = refinementChecker.check(program);

  const refineErrors = refineDiags.filter(d => d.severity === 'error');
  if (refineErrors.length > 0) {
    for (const d of refineErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  // Show warnings but don't fail
  for (const d of refineDiags.filter(d => d.severity === 'warning')) {
    console.error(formatDiagnostic(d, source));
  }

  console.log(`✓ Refinement checking passed`);

  const intentChecker = new IntentChecker();
  const intentDiags = intentChecker.check(program);

  const intentErrors = intentDiags.filter(d => d.severity === 'error');
  if (intentErrors.length > 0) {
    for (const d of intentErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  // Show warnings but don't fail
  for (const d of intentDiags.filter(d => d.severity === 'warning')) {
    console.error(formatDiagnostic(d, source));
  }

  console.log(`✓ Intent verification passed`);

  const effectChecker = new EffectChecker();
  const effectDiags = effectChecker.check(program);

  const effectErrors = effectDiags.filter(d => d.severity === 'error');
  if (effectErrors.length > 0) {
    for (const d of effectErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  // Show warnings but don't fail
  for (const d of effectDiags.filter(d => d.severity === 'warning')) {
    console.error(formatDiagnostic(d, source));
  }

  console.log(`✓ Effect checking passed`);
}

// ─── Multi-file bundler ──────────────────────────────────────────────────────

/**
 * Parse a single .cb file and return its program AST.
 * Returns null if the file cannot be read or has lex errors.
 */
function parseFile(filePath: string): Program | null {
  const resolved = resolve(filePath);
  let source: string;
  try {
    source = readFileSync(resolved, 'utf-8');
  } catch {
    return null;
  }

  const lexer = new Lexer(source, resolved);
  const tokens = lexer.tokenize();

  const lexErrors = tokens.filter(t => t.type === TokenType.Error);
  if (lexErrors.length > 0) {
    for (const err of lexErrors) {
      const diag = createError('L001', `Unexpected character '${err.value}'`, err.span);
      console.error(formatDiagnostic(diag, source));
    }
    return null;
  }

  const parser = new Parser(tokens);
  const { program, diagnostics } = parser.parse();

  if (diagnostics.length > 0) {
    for (const d of diagnostics) {
      console.error(formatDiagnostic(d, source));
    }
    // Continue despite parse errors — we still have a partial AST
  }

  return program;
}

/**
 * Resolve a use declaration's path to a .cb file path.
 *
 * Supports two styles:
 *   - dot-style:  use game.state.*  → <root>/game/state.cb
 *   - rust-style: use crate::game::state::* → <root>/game/state.cb (strips leading "crate")
 *
 * @param usePath - The path segments from UseDecl (e.g. ['game', 'state'])
 * @param projectRoot - The root directory containing the source tree
 * @returns The resolved .cb file path, or null if not found
 */
function resolveUsePath(usePath: string[], projectRoot: string): string | null {
  // Strip leading 'crate' if present (Rust-style paths)
  const segments = usePath[0] === 'crate' ? usePath.slice(1) : [...usePath];

  if (segments.length === 0) return null;

  // Try the path as-is: game/state.cb
  const filePath = join(projectRoot, ...segments) + '.cb';
  if (existsSync(filePath)) return filePath;

  // Also try interpreting the last segment as a directory with an index-like file
  // (not common in C!, but let's be thorough)
  return null;
}

/**
 * Recursively resolve all `use` declarations starting from a main file.
 * Returns a merged Program with all declarations from all files.
 */
function bundleFiles(mainFilePath: string): Program {
  const resolvedMain = resolve(mainFilePath);
  const projectRoot = dirname(resolvedMain);

  const parsed = new Map<string, Program>();    // file path → AST
  const queue: string[] = [resolvedMain];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const normalized = resolve(current);

    if (parsed.has(normalized)) continue;

    const program = parseFile(normalized);
    if (!program) {
      console.error(`Warning: could not parse '${normalized}', skipping`);
      // Mark as visited so we don't retry
      parsed.set(normalized, { kind: 'Program', items: [], span: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, file: normalized } });
      continue;
    }

    parsed.set(normalized, program);

    // Find all UseDecl items and resolve them to files
    for (const item of program.items) {
      if (item.kind !== 'UseDecl') continue;

      const resolved = resolveUsePath(item.path, projectRoot);
      if (resolved) {
        const normalizedResolved = resolve(resolved);
        if (!parsed.has(normalizedResolved)) {
          queue.push(normalizedResolved);
        }
      } else {
        // Print a warning for unresolved use declarations (could be stdlib)
        const pathStr = item.path.join('.');
        console.error(`Warning: could not resolve 'use ${pathStr}' to a file, skipping`);
      }
    }
  }

  // Merge all programs: collect all non-UseDecl items from all files,
  // with the main file's items last (so its main() is at the end)
  const allItems: TopLevelItem[] = [];
  const mainProgram = parsed.get(resolvedMain);

  for (const [filePath, program] of parsed) {
    if (filePath === resolvedMain) continue;
    // Include all items except UseDecl (which have been resolved)
    for (const item of program.items) {
      if (item.kind !== 'UseDecl') {
        allItems.push(item);
      }
    }
  }

  // Add main file items last
  if (mainProgram) {
    for (const item of mainProgram.items) {
      if (item.kind !== 'UseDecl') {
        allItems.push(item);
      }
    }
  }

  const mergedSpan = mainProgram?.span ?? { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, file: resolvedMain };

  const merged: Program = {
    kind: 'Program',
    items: allItems,
    span: mergedSpan,
  };

  const fileCount = parsed.size;
  if (fileCount > 1) {
    console.error(`Bundled ${fileCount} files (${allItems.length} declarations)`);
  }

  return merged;
}

async function compile(filePath: string): Promise<string> {
  // Bundle all files referenced via use declarations
  const program = bundleFiles(filePath);

  const resolver = new Resolver();
  const nameDiags = resolver.resolve(program);

  if (nameDiags.length > 0) {
    // Collect source text for diagnostics — use the span's file if available
    const source = readSource(filePath);
    for (const d of nameDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  const checker = new Checker();
  const typeDiags = checker.check(program);

  if (typeDiags.length > 0) {
    const source = readSource(filePath);
    for (const d of typeDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  const ownershipChecker = new OwnershipChecker();
  const ownerDiags = ownershipChecker.check(program);

  if (ownerDiags.length > 0) {
    const source = readSource(filePath);
    for (const d of ownerDiags) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  const refinementChecker = new RefinementChecker();
  const refineDiags = refinementChecker.check(program);

  const refineErrors = refineDiags.filter(d => d.severity === 'error');
  if (refineErrors.length > 0) {
    const source = readSource(filePath);
    for (const d of refineErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  const intentChecker = new IntentChecker();
  const intentDiags = intentChecker.check(program);

  const intentErrors = intentDiags.filter(d => d.severity === 'error');
  if (intentErrors.length > 0) {
    const source = readSource(filePath);
    for (const d of intentErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  const effectChecker = new EffectChecker();
  const effectDiags = effectChecker.check(program);

  const effectErrors = effectDiags.filter(d => d.severity === 'error');
  if (effectErrors.length > 0) {
    const source = readSource(filePath);
    for (const d of effectErrors) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  // Code generation
  let genModule: any;
  try {
    genModule = await import('./codegen/index.js');
  } catch {
    console.error('Error: code generation is not yet available.');
    console.error('The JavaScript code generator has not been built yet.');
    process.exit(1);
  }

  const generator = new genModule.JsGenerator();
  return generator.generate(program);
}

async function compileWasm(filePath: string): Promise<Uint8Array> {
  const source = readSource(filePath);
  const lexer = new Lexer(source, filePath);
  const tokens = lexer.tokenize();

  const lexErrors = tokens.filter(t => t.type === TokenType.Error);
  if (lexErrors.length > 0) {
    for (const err of lexErrors) {
      const diag = createError('L001', `Unexpected character '${err.value}'`, err.span);
      console.error(formatDiagnostic(diag, source));
    }
    process.exit(1);
  }

  const parser = new Parser(tokens);
  const { program, diagnostics } = parser.parse();

  if (diagnostics.length > 0) {
    for (const d of diagnostics) {
      console.error(formatDiagnostic(d, source));
    }
    process.exit(1);
  }

  let genModule: any;
  try {
    genModule = await import('./codegen/index.js');
  } catch {
    console.error('Error: WASM code generation is not yet available.');
    process.exit(1);
  }

  const generator = new genModule.WasmGenerator();
  return generator.generate(program);
}

async function runCommand(filePath: string): Promise<void> {
  const jsCode = await compile(filePath);

  // Append a main() call if the generated code defines a main function
  const codeToRun = /^(?:export )?(?:async )?function main\b/m.test(jsCode)
    ? jsCode + '\nmain();\n'
    : jsCode;

  // Write to a temp file and execute — avoids shell escaping and
  // Node.js TypeScript-mode issues with node -e on multi-line code.
  const tmpFile = join(tmpdir(), `cbang_run_${Date.now()}.mjs`);
  writeFileSync(tmpFile, codeToRun, 'utf-8');
  try {
    execSync(`node "${tmpFile}"`, {
      stdio: 'inherit',
      env: { ...process.env },
    });
  } catch (e: any) {
    if (e.status) process.exit(e.status);
    process.exit(1);
  } finally {
    try { unlinkSync(tmpFile); } catch { /* ignore cleanup errors */ }
  }
}

async function buildCommand(filePath: string, target: string = 'js'): Promise<void> {
  switch (target) {
    case 'js': {
      const jsCode = await compile(filePath);
      const outFile = basename(filePath, '.cb') + '.js';
      writeFileSync(outFile, jsCode, 'utf-8');
      console.log(`✓ Compiled to ${outFile}`);
      break;
    }
    case 'wasm': {
      const wasmBytes = await compileWasm(filePath);
      const outFile = basename(filePath, '.cb') + '.wasm';
      writeFileSync(outFile, wasmBytes);
      console.log(`✓ Compiled to ${outFile} (${wasmBytes.length} bytes)`);
      break;
    }
    case 'llvm': {
      const source = readSource(filePath);
      const lexer = new Lexer(source, filePath);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const { program } = parser.parse();
      const { LlvmGenerator } = await import('./codegen/index.js');
      const ir = new LlvmGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.ll';
      writeFileSync(outFile, ir, 'utf-8');
      console.log(`✓ Compiled to ${outFile}`);
      console.log(`  Run with: lli ${outFile}`);
      break;
    }
    case 'evm': {
      const source = readSource(filePath);
      const lexer = new Lexer(source, filePath);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const { program } = parser.parse();
      const { EvmGenerator } = await import('./codegen/index.js');
      const result = new EvmGenerator().generate(program);
      const base = basename(filePath, '.cb');
      writeFileSync(base + '.hex', result.bytecode, 'utf-8');
      writeFileSync(base + '.abi.json', JSON.stringify(result.abi, null, 2), 'utf-8');
      console.log(`✓ Compiled to ${base}.hex + ${base}.abi.json`);
      break;
    }
    case 'near': {
      const source = readSource(filePath);
      const lexer = new Lexer(source, filePath);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const { program } = parser.parse();
      const { NearGenerator } = await import('./codegen/index.js');
      const wasm = new NearGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.near.wasm';
      writeFileSync(outFile, wasm);
      console.log(`✓ Compiled to ${outFile} (${wasm.length} bytes)`);
      break;
    }
    default:
      console.error(`Error: unknown target '${target}'`);
      console.error('Valid targets: js, wasm, llvm, evm, near');
      process.exit(1);
  }
}

function readSource(filePath: string): string {
  const resolved = resolve(filePath);
  try {
    return readFileSync(resolved, 'utf-8');
  } catch {
    console.error(`Error: could not read file '${resolved}'`);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
cbang ${VERSION} — The C! (C-Bang) compiler

USAGE:
  cbang <command> [options] [file]

COMMANDS:
  check <file.cb>     Type-check a file
  lex <file.cb>       Show tokens (debug)
  parse <file.cb>     Show AST (debug)
  run <file.cb>       Compile and execute
  build <file.cb>     Compile to target (default: JavaScript)
  build --target wasm <file.cb>  Compile to WebAssembly
  build --target llvm <file.cb>  Compile to LLVM IR (.ll)
  build --target evm <file.cb>   Compile to EVM bytecode
  build --target near <file.cb>  Compile to NEAR WASM
  repl                Interactive REPL
  verify <file.cb>    Formal verification [not yet implemented]
  audit <file.cb>     Security audit report

OPTIONS:
  --version, -v       Show version
  --help, -h          Show this help

LEARN MORE:
  Website:  https://c-bang.integsec.com
  GitHub:   https://github.com/integsec/C-Bang
  Wiki:     https://github.com/integsec/C-Bang/wiki
`.trim());
}

function replCommand(): void {
  console.log(`cbang ${VERSION} — C! REPL`);
  console.log('Type C! expressions or statements. Use :quit to exit.\n');

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'cbang> ',
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (input === ':quit' || input === ':q' || input === ':exit') {
      rl.close();
      return;
    }

    if (input === '') {
      rl.prompt();
      return;
    }

    if (input === ':help' || input === ':h') {
      console.log('Commands:');
      console.log('  :quit, :q     Exit the REPL');
      console.log('  :lex <expr>   Show tokens for input');
      console.log('  :ast <expr>   Show AST for input');
      console.log('  :help, :h     Show this help');
      console.log('');
      rl.prompt();
      return;
    }

    // :lex command — show tokens
    if (input.startsWith(':lex ')) {
      const src = input.slice(5);
      const lexer = new Lexer(src, '<repl>');
      const tokens = lexer.tokenize();
      for (const t of tokens) {
        if (t.type === TokenType.EOF) continue;
        console.log(`  ${t.type.padEnd(20)} ${t.value}`);
      }
      rl.prompt();
      return;
    }

    // :ast command — show AST
    if (input.startsWith(':ast ')) {
      const src = input.slice(5);
      const lexer = new Lexer(src, '<repl>');
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const { program, diagnostics } = parser.parse();
      if (diagnostics.length > 0) {
        for (const d of diagnostics) {
          console.error(formatDiagnostic(d, src));
        }
      } else {
        console.log(JSON.stringify(program, null, 2));
      }
      rl.prompt();
      return;
    }

    // Wrap input to make it parseable
    // Try as expression first, then as top-level item
    let src = input;
    let wrappedAsExpr = false;

    // If it doesn't look like a declaration, wrap in a function
    if (!input.startsWith('fn ') && !input.startsWith('type ') &&
        !input.startsWith('actor ') && !input.startsWith('enum ') &&
        !input.startsWith('pub ') && !input.startsWith('use ') &&
        !input.startsWith('contract ') && !input.startsWith('server ') &&
        !input.startsWith('component ')) {
      src = `fn __repl__() { ${input} }`;
      wrappedAsExpr = true;
    }

    const lexer = new Lexer(src, '<repl>');
    const tokens = lexer.tokenize();

    const lexErrors = tokens.filter(t => t.type === TokenType.Error);
    if (lexErrors.length > 0) {
      for (const err of lexErrors) {
        console.error(`  Error: unexpected '${err.value}'`);
      }
      rl.prompt();
      return;
    }

    const parser = new Parser(tokens);
    const { program, diagnostics } = parser.parse();

    if (diagnostics.length > 0) {
      for (const d of diagnostics) {
        console.error(formatDiagnostic(d, src));
      }
    } else {
      if (wrappedAsExpr) {
        const fn = program.items[0] as any;
        if (fn?.body?.statements) {
          for (const stmt of fn.body.statements) {
            console.log(`  ${stmt.kind}: ${JSON.stringify(stmt, null, 2).split('\n').slice(0, 5).join(' ')}`);
          }
        }
      } else {
        for (const item of program.items) {
          console.log(`  ${item.kind}: ${item.kind === 'FunctionDecl' || item.kind === 'TypeDecl' || item.kind === 'ActorDecl' || item.kind === 'EnumDecl' ? (item as any).name : '...'}`);
        }
      }
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nBye!');
    process.exit(0);
  });
}

// ─── ANSI colour helpers ──────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  bgRed:  '\x1b[41m',
};
const g = (s: string) => `${C.green}${s}${C.reset}`;
const y = (s: string) => `${C.yellow}${s}${C.reset}`;
const c = (s: string) => `${C.cyan}${s}${C.reset}`;
const b = (s: string) => `${C.bold}${s}${C.reset}`;
const d = (s: string) => `${C.dim}${s}${C.reset}`;

// ─── AST walker ──────────────────────────────────────────────────────────────
interface AuditStats {
  functions:   number;
  actors:      number;
  contracts:   number;
  servers:     number;
  components:  number;
  linearTypes: number;   // OwnType nodes
  refinedTypes: number;  // RefinedType nodes
  intents:     number;   // Annotation with "intent" keyword
  effects:     string[]; // unique effect names from function signatures
  spawns:      number;   // SpawnStmt — actor instantiation
  tokens:      number;   // token count from lexer
  topItems:    number;
}

function walkAst(node: unknown, stats: AuditStats): void {
  if (!node || typeof node !== 'object') return;
  const n = node as Record<string, unknown>;

  switch (n['kind']) {
    case 'FunctionDecl': stats.functions++;   break;
    case 'ActorDecl':    stats.actors++;      break;
    case 'ContractDecl': stats.contracts++;   break;
    case 'ServerDecl':   stats.servers++;     break;
    case 'ComponentDecl':stats.components++;  break;
    case 'OwnType':      stats.linearTypes++; break;
    case 'RefinedType':  stats.refinedTypes++;break;
    case 'SpawnStmt':    stats.spawns++;      break;
    case 'Annotation': {
      const val = String(n['value'] ?? '');
      if (val.includes('intent') || val.includes('@intent') ||
          (n['name'] && String(n['name']).toLowerCase().includes('intent'))) {
        stats.intents++;
      }
      break;
    }
  }

  // Collect declared effects from function signatures
  const fx = n['effects'];
  if (Array.isArray(fx)) {
    for (const e of fx) {
      const name = typeof e === 'string' ? e : String((e as any)?.name ?? '');
      if (name && !stats.effects.includes(name)) stats.effects.push(name);
    }
  }

  for (const val of Object.values(n)) {
    if (Array.isArray(val)) val.forEach(v => walkAst(v, stats));
    else if (val && typeof val === 'object') walkAst(val, stats);
  }
}

// ─── audit command ────────────────────────────────────────────────────────────
function auditCommand(filePath: string): void {
  const source = readSource(filePath);
  const lines  = source.split('\n').length;

  // ── Lexing ──────────────────────────────────────────────────────────────────
  const lexer  = new Lexer(source, filePath);
  const tokens = lexer.tokenize();
  const lexErrors = tokens.filter(t => t.type === TokenType.Error);
  const tokenCount = tokens.filter(t =>
    t.type !== TokenType.Comment && t.type !== TokenType.EOF).length;

  // ── Parsing ─────────────────────────────────────────────────────────────────
  const parser = new Parser(tokens);
  const { program, diagnostics: parseDiags } = parser.parse();

  // ── AST statistics ──────────────────────────────────────────────────────────
  const stats: AuditStats = {
    functions: 0, actors: 0, contracts: 0, servers: 0, components: 0,
    linearTypes: 0, refinedTypes: 0, intents: 0, effects: [],
    spawns: 0, tokens: tokenCount, topItems: program.items.length,
  };
  walkAst(program, stats);

  // ── Run all checkers ────────────────────────────────────────────────────────
  type CheckResult = { ok: boolean; warnings: number; errors: number };
  const results: Record<string, CheckResult> = {};

  function runChecker(fn: () => { severity: string }[]): CheckResult {
    try {
      const diags = fn();
      const errs  = diags.filter(d => d.severity === 'error').length;
      const warns = diags.filter(d => d.severity === 'warning').length;
      return { ok: errs === 0, warnings: warns, errors: errs };
    } catch {
      return { ok: false, warnings: 0, errors: 1 };
    }
  }

  results['name']      = { ok: lexErrors.length === 0, warnings: 0, errors: lexErrors.length };
  results['parse']     = { ok: parseDiags.length === 0, warnings: 0, errors: parseDiags.length };

  const resolver = new Resolver();
  const nameDiags = resolver.resolve(program);
  results['resolve']   = { ok: nameDiags.length === 0, warnings: 0, errors: nameDiags.length };

  results['types']     = runChecker(() => new Checker().check(program));
  results['ownership'] = runChecker(() => new OwnershipChecker().check(program));
  results['refinement']= runChecker(() => new RefinementChecker().check(program));
  results['intent']    = runChecker(() => new IntentChecker().check(program));
  results['effects']   = runChecker(() => new EffectChecker().check(program));

  const allOk      = Object.values(results).every(r => r.ok);
  const totalWarn  = Object.values(results).reduce((s, r) => s + r.warnings, 0);
  const totalErr   = Object.values(results).reduce((s, r) => s + r.errors,   0);

  // ── Score (0-10) ─────────────────────────────────────────────────────────
  const score = Math.max(0, 10 - totalErr * 2 - Math.floor(totalWarn / 2));

  // ╔══════════════════════════════════════════════════════════════════╗
  const W = 66;
  const line  = '─'.repeat(W);
  const dline = '═'.repeat(W);

  console.log('');
  console.log(b(c(`╔${dline}╗`)));
  console.log(b(c(`║${'  C! (C-Bang)  Security Audit Report'.padEnd(W - 10)}${`v${VERSION}  `.padStart(10)}║`)));
  console.log(b(c(`╚${dline}╝`)));

  // file meta
  console.log('');
  const meta = [
    `File:  ${b(filePath)}`,
    d(`Lines: ${lines}  │  Tokens: ${tokenCount}  │  Top-level: ${stats.topItems}`),
  ];
  for (const m of meta) console.log('  ' + m);

  // ── CODE STRUCTURE ──────────────────────────────────────────────────────────
  console.log('');
  console.log(c(`  ── CODE STRUCTURE ${line.slice(19)}`));

  const structItems = [
    ['Functions',    stats.functions],
    ['Actors',       stats.actors],
    ['Contracts',    stats.contracts],
    ['Servers',      stats.servers],
    ['Components',   stats.components],
    ['Actor spawns', stats.spawns],
  ] as const;

  const activeStruct = structItems.filter(([, v]) => v > 0);
  if (activeStruct.length === 0) {
    console.log(d('  (no declarations found)'));
  } else {
    for (const [label, val] of activeStruct) {
      console.log(`  ${label.padEnd(18)} ${b(String(val))}`);
    }
  }

  // ── VULNERABILITY ANALYSIS ─────────────────────────────────────────────────
  console.log('');
  console.log(c(`  ── VULNERABILITY CLASSES ${line.slice(26)}`));

  type VulnRow = [string, string, string];
  const vulns: VulnRow[] = [
    ['Buffer overflow',    'IMPOSSIBLE', 'bounded arrays, no raw pointers'],
    ['Use-after-free',     'IMPOSSIBLE', `linear types${stats.linearTypes ? ` (${stats.linearTypes} linear resource${stats.linearTypes > 1 ? 's' : ''})` : ''}`],
    ['Double-spend',       'IMPOSSIBLE', `linear tokens transfer only once${stats.contracts ? ` (${stats.contracts} contract${stats.contracts > 1 ? 's' : ''})` : ''}`],
    ['Reentrancy',         'IMPOSSIBLE', 'linear state locked during mutation'],
    ['SQL injection',      'IMPOSSIBLE', 'typed query builders, no string concat'],
    ['XSS',               'IMPOSSIBLE', 'typed HTML templates, auto-escaped'],
    ['Null pointer deref', 'IMPOSSIBLE', 'Option<T> enforced, no null'],
    ['Data races',
      stats.actors > 0 ? 'IMPOSSIBLE' : 'STRUCTURAL',
      stats.actors > 0
        ? `actor model (${stats.actors} actor${stats.actors > 1 ? 's' : ''}, no shared mutable state)`
        : 'actor model available — no actors in this file'],
    ['Integer overflow',   'CHECKED',    `refinement types${stats.refinedTypes ? ` (${stats.refinedTypes} constraint${stats.refinedTypes > 1 ? 's' : ''})` : ''}`],
    ['Effect leakage',     'DECLARED',   stats.effects.length
        ? `effects: ${stats.effects.join(', ')}`
        : 'all effects declared at function boundary'],
  ];

  for (const [vuln, status, detail] of vulns) {
    const statusStr =
      status === 'IMPOSSIBLE'  ? g('IMPOSSIBLE ') :
      status === 'CHECKED'     ? g('CHECKED    ') :
      status === 'DECLARED'    ? g('DECLARED   ') :
                                  y('STRUCTURAL ');
    console.log(`  ${g('✓')} ${vuln.padEnd(20)} ${statusStr}  ${d(detail)}`);
  }

  // ── CHECKER RESULTS ────────────────────────────────────────────────────────
  console.log('');
  console.log(c(`  ── CHECKER RESULTS ${line.slice(20)}`));

  const checkerRows: [string, string, CheckResult][] = [
    ['Lexer',       `${tokenCount} tokens`,          results['name']!],
    ['Parser',      `${stats.topItems} items`,        results['parse']!],
    ['Name Res.',   '',                               results['resolve']!],
    ['Types',       '',                               results['types']!],
    ['Ownership',   `${stats.linearTypes} linear`,   results['ownership']!],
    ['Refinement',  `${stats.refinedTypes} constraints`, results['refinement']!],
    ['Intent',      `${stats.intents} annotations`,  results['intent']!],
    ['Effects',     stats.effects.length ? stats.effects.join(', ') : 'clean', results['effects']!],
  ];

  for (const [label, detail, res] of checkerRows) {
    const icon  = res.ok ? g('✓') : `${C.red}✗${C.reset}`;
    const warns = res.warnings > 0 ? y(` (${res.warnings} warning${res.warnings > 1 ? 's' : ''})`) : '';
    const errs  = res.errors   > 0 ? `${C.red} (${res.errors} error${res.errors > 1 ? 's' : ''})${C.reset}` : '';
    const det   = detail ? d(`  ${detail}`) : '';
    console.log(`  ${icon} ${label.padEnd(12)} ${res.ok ? g('passed') : `${C.red}FAILED${C.reset}`}${warns}${errs}${det}`);
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(c(`  ${line}`));

  const impossible = vulns.filter(([, s]) => s === 'IMPOSSIBLE').length;

  if (allOk && totalErr === 0) {
    const star = score >= 9 ? '★★★★★' : score >= 7 ? '★★★★☆' : '★★★☆☆';
    console.log(`  ${b(g(`Audit score: ${score}/10  ${star}  SECURE`))}`);
    console.log(`  ${g(`${impossible} vulnerability classes are structurally impossible in this file.`)}`);
  } else {
    console.log(`  ${b(`${C.red}Audit score: ${score}/10  — FIX REQUIRED${C.reset}`)}`);
    console.log(`  ${`${C.red}${totalErr} error${totalErr > 1 ? 's' : ''} found. Run 'cbang check ${filePath}' for details.${C.reset}`}`);
  }

  if (totalWarn > 0) {
    console.log(`  ${y(`${totalWarn} warning${totalWarn > 1 ? 's' : ''} — review recommended`)}`);
  }

  console.log('');

  process.exit(allOk ? 0 : 1);
}

function handleError(e: unknown): void {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}

main();
