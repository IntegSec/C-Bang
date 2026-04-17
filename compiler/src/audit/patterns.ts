/**
 * Pattern-based vulnerability detector for `cbang audit`.
 *
 * Walks the AST looking for code patterns commonly associated with
 * security vulnerabilities. Unlike the structural checkers (ownership,
 * effects, refinement) this is a heuristic scanner — findings should be
 * reviewed by a human, but every finding points at a real construct in
 * the source.
 *
 * Categories detected:
 *   SEC001  hardcoded_secret     — credential-like name bound to a string literal
 *   SEC002  weak_crypto          — call to MD5/SHA1/DES/RC4/MD4
 *   SEC003  dangerous_eval       — eval/exec/system with non-literal argument
 *   SEC004  insecure_url         — http:// literal (cleartext transport)
 *   SEC005  path_traversal       — literal containing ".." path segment
 *   SEC006  sql_concat           — query/execute called with a string-concat argument
 *   SEC007  weak_random          — Math.random / rand() used where Crypto.random is expected
 *   SEC008  todo_security        — string literal containing security TODO/FIXME marker
 */

import type {
  Program,
  TopLevelItem,
  FunctionDecl,
  ActorDecl,
  ContractDecl,
  ServerDecl,
  ComponentDecl,
  Block,
  Stmt,
  Expr,
  LetStmt,
  CallExpr,
  MethodCallExpr,
  StringInterpolationExpr,
} from '../ast/index.js';
import type { Span } from '../lexer/index.js';

// ─── Public API ──────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Finding {
  code: string;
  category: string;
  severity: Severity;
  message: string;
  span: Span;
  suggestion?: string;
}

export function scanPatterns(program: Program): Finding[] {
  const scanner = new PatternScanner();
  return scanner.scan(program);
}

// ─── Detection rules (data-driven) ───────────────────────────────

/** Names suggesting credential storage when bound to a string literal. */
const SECRET_NAME_RE = /(password|passwd|secret|api[_-]?key|access[_-]?key|private[_-]?key|auth[_-]?token|bearer|jwt[_-]?secret|credential|client[_-]?secret)/i;

/** Cryptographically broken or weak primitives. */
const WEAK_CRYPTO = new Set([
  'md4', 'md5', 'sha1', 'des', 'des3', '3des', 'rc4', 'rc2',
  'md5_hex', 'sha1_hex', 'md5sum', 'sha1sum',
]);

/** Calls treated as dynamic-code execution sinks. */
const DANGEROUS_EVAL = new Set([
  'eval', 'exec', 'execute', 'system', 'shell', 'spawn_shell',
  'shell_exec', 'popen', 'compile_and_run',
]);

/** Calls that accept a SQL string and should never be string-concatenated. */
const SQL_FUNCS = new Set([
  'query', 'execute', 'exec_sql', 'sql', 'raw_query', 'unsafe_query',
]);

/** Weak randomness identifiers (any context they appear in is suspicious). */
const WEAK_RANDOM = new Set([
  'rand', 'random', 'math_random', 'mt_rand',
]);

/** Acceptable cleartext URL prefixes (these don't trigger SEC004). */
const CLEARTEXT_ALLOWLIST = [
  'http://localhost',
  'http://127.0.0.1',
  'http://0.0.0.0',
  'http://[::1]',
  'http://example.com',
  'http://example.org',
  'http://schemas.',           // XML namespaces
  'http://www.w3.org',
];

const TODO_SEC_RE = /\b(TODO|FIXME|XXX|HACK)\b.*\b(security|secure|auth|vuln|inject|sanitize|escape|crypto|password|secret|token)\b/i;

// ─── Scanner ─────────────────────────────────────────────────────

class PatternScanner {
  private findings: Finding[] = [];

  scan(program: Program): Finding[] {
    this.findings = [];
    for (const item of program.items) {
      this.scanItem(item);
    }
    // Sort by file position for deterministic output
    this.findings.sort((a, b) => {
      const al = a.span.start.line - b.span.start.line;
      return al !== 0 ? al : a.span.start.column - b.span.start.column;
    });
    return this.findings;
  }

  private scanItem(item: TopLevelItem): void {
    switch (item.kind) {
      case 'FunctionDecl':
        this.scanBlock((item as FunctionDecl).body);
        break;
      case 'ActorDecl':
        this.scanActor(item as ActorDecl);
        break;
      case 'ContractDecl':
        this.scanContract(item as ContractDecl);
        break;
      case 'ServerDecl':
        this.scanServer(item as ServerDecl);
        break;
      case 'ComponentDecl':
        this.scanBlock((item as ComponentDecl).body);
        break;
      // TypeDecl/EnumDecl/UseDecl/ModDecl/StateDecl have no executable body
      default:
        break;
    }
  }

  private scanActor(decl: ActorDecl): void {
    for (const m of decl.members) {
      if (m.kind === 'FunctionDecl') this.scanBlock(m.body);
      else if (m.kind === 'OnHandler') this.scanBlock(m.body);
      else if (m.kind === 'InitDecl') this.scanBlock(m.body);
      else if (m.kind === 'StateDecl' && m.initializer) this.scanExpr(m.initializer);
    }
  }

  private scanContract(decl: ContractDecl): void {
    for (const m of decl.members) {
      if (m.kind === 'FunctionDecl') this.scanBlock(m.body);
      else if (m.kind === 'InitDecl') this.scanBlock(m.body);
      else if (m.kind === 'StateDecl' && m.initializer) this.scanExpr(m.initializer);
    }
  }

  private scanServer(decl: ServerDecl): void {
    for (const m of decl.members) {
      if (m.kind === 'FunctionDecl') this.scanBlock(m.body);
      else if (m.kind === 'StateDecl' && m.initializer) this.scanExpr(m.initializer);
      else if (m.kind === 'FieldAssignment') this.scanExpr(m.value);
    }
  }

  private scanBlock(block: Block): void {
    for (const stmt of block.statements) this.scanStmt(stmt);
  }

  private scanStmt(stmt: Stmt): void {
    switch (stmt.kind) {
      case 'LetStmt':
        this.checkHardcodedSecret(stmt);
        this.scanExpr(stmt.initializer);
        break;
      case 'ExprStmt':
        this.scanExpr(stmt.expr);
        break;
      case 'ReturnStmt':
        if (stmt.value) this.scanExpr(stmt.value);
        break;
      case 'ReplyStmt':
        this.scanExpr(stmt.value);
        break;
      case 'EmitStmt':
        for (const a of stmt.args) this.scanExpr(a);
        break;
      case 'AssignStmt':
        this.scanExpr(stmt.target);
        this.scanExpr(stmt.value);
        // Treat assignment to a credential-named field as a hardcoded secret.
        if (
          stmt.target.kind === 'FieldAccess' &&
          SECRET_NAME_RE.test(stmt.target.field) &&
          stmt.value.kind === 'StringLiteral' &&
          stmt.value.value.length >= 8
        ) {
          this.report({
            code: 'SEC001',
            category: 'hardcoded_secret',
            severity: 'high',
            message: `Hardcoded credential assigned to '${stmt.target.field}'`,
            span: stmt.span,
            suggestion: 'Load secrets from env/secret-store, never commit literals.',
          });
        }
        break;
      case 'IfStmt':
        this.scanExpr(stmt.condition);
        this.scanBlock(stmt.then);
        if (stmt.else_) {
          if (stmt.else_.kind === 'IfStmt') this.scanStmt(stmt.else_);
          else this.scanBlock(stmt.else_);
        }
        break;
      case 'WhileStmt':
        this.scanExpr(stmt.condition);
        this.scanBlock(stmt.body);
        break;
      case 'ForStmt':
        this.scanExpr(stmt.iterable);
        this.scanBlock(stmt.body);
        break;
      case 'MatchStmt':
        this.scanExpr(stmt.subject);
        for (const arm of stmt.arms) {
          if (arm.body.kind === 'Block') this.scanBlock(arm.body);
          else this.scanExpr(arm.body);
        }
        break;
      case 'SpawnStmt':
        for (const a of stmt.args) this.scanExpr(a);
        break;
      case 'DeployStmt':
        for (const a of stmt.args) this.scanExpr(a.value);
        break;
    }
  }

  private scanExpr(expr: Expr): void {
    switch (expr.kind) {
      case 'StringLiteral':
        this.checkLiteralString(expr.value, expr.span);
        break;
      case 'StringInterpolation':
        this.checkInterpolation(expr);
        break;
      case 'Ident':
        this.checkWeakRandom(expr.name, expr.span);
        break;
      case 'Path':
        this.checkWeakRandom(expr.segments[expr.segments.length - 1] ?? '', expr.span);
        break;
      case 'Call':
        this.checkCall(expr);
        break;
      case 'MethodCall':
        this.checkMethodCall(expr);
        break;
      case 'Binary':
        this.scanExpr(expr.left);
        this.scanExpr(expr.right);
        break;
      case 'Unary':
        this.scanExpr(expr.operand);
        break;
      case 'FieldAccess':
        this.scanExpr(expr.object);
        break;
      case 'Index':
        this.scanExpr(expr.object);
        this.scanExpr(expr.index);
        break;
      case 'Struct':
        for (const f of expr.fields) {
          // struct field literals can also hold secrets
          if (
            SECRET_NAME_RE.test(f.name) &&
            f.value.kind === 'StringLiteral' &&
            f.value.value.length >= 8
          ) {
            this.report({
              code: 'SEC001',
              category: 'hardcoded_secret',
              severity: 'high',
              message: `Hardcoded credential in struct field '${f.name}'`,
              span: f.span,
              suggestion: 'Load secrets from env/secret-store, never commit literals.',
            });
          }
          this.scanExpr(f.value);
        }
        break;
      case 'BlockExpr':
        this.scanBlock(expr.block);
        break;
      case 'IfExpr':
        this.scanExpr(expr.condition);
        this.scanBlock(expr.then);
        if (expr.else_) {
          if (expr.else_.kind === 'IfExpr') this.scanExpr(expr.else_);
          else this.scanBlock(expr.else_);
        }
        break;
      case 'MatchExpr':
        this.scanExpr(expr.subject);
        for (const arm of expr.arms) {
          if (arm.body.kind === 'Block') this.scanBlock(arm.body);
          else this.scanExpr(arm.body);
        }
        break;
      case 'Parallel':
        this.scanBlock(expr.body);
        break;
      case 'Scope':
        this.scanExpr(expr.initializer);
        this.scanBlock(expr.body);
        break;
      case 'MacroCall':
        for (const a of expr.args) this.scanExpr(a);
        break;
      case 'Range':
        if (expr.start) this.scanExpr(expr.start);
        if (expr.end) this.scanExpr(expr.end);
        break;
      case 'ArrayLiteral':
        for (const e of expr.elements) this.scanExpr(e);
        break;
      case 'Closure':
        if (expr.body.kind === 'Block') this.scanBlock(expr.body);
        else this.scanExpr(expr.body);
        break;
      // IntLiteral / FloatLiteral / BoolLiteral — nothing to inspect
      default:
        break;
    }
  }

  // ─── Specific checks ─────────────────────────────────────────

  private checkHardcodedSecret(stmt: LetStmt): void {
    if (!SECRET_NAME_RE.test(stmt.name)) return;
    const init = stmt.initializer;
    if (init.kind !== 'StringLiteral') return;
    if (init.value.length < 8) return;
    // Skip common placeholders
    if (/^(changeme|placeholder|todo|xxx|none|null|undefined|example)$/i.test(init.value)) return;
    this.report({
      code: 'SEC001',
      category: 'hardcoded_secret',
      severity: 'high',
      message: `Hardcoded secret in variable '${stmt.name}'`,
      span: stmt.span,
      suggestion: 'Load from env/secret-store, never commit literals to source.',
    });
  }

  private checkCall(expr: CallExpr): void {
    const name = calleeName(expr.callee);
    if (name) {
      const lower = name.toLowerCase();

      if (WEAK_CRYPTO.has(lower)) {
        this.report({
          code: 'SEC002',
          category: 'weak_crypto',
          severity: 'high',
          message: `Cryptographically broken primitive '${name}' in use`,
          span: expr.span,
          suggestion: 'Use SHA-256+ for hashing, AES-GCM/ChaCha20 for encryption.',
        });
      }

      if (DANGEROUS_EVAL.has(lower)) {
        const dynamic = expr.args.some(a => !isStaticString(a.value));
        this.report({
          code: 'SEC003',
          category: 'dangerous_eval',
          severity: dynamic ? 'critical' : 'medium',
          message: dynamic
            ? `'${name}' invoked with non-literal argument — potential code/command injection`
            : `'${name}' is a dynamic-execution sink; review whether it is needed`,
          span: expr.span,
          suggestion: 'Replace with a typed API; if unavoidable, validate inputs against an allow-list.',
        });
      }

      if (SQL_FUNCS.has(lower)) {
        for (const arg of expr.args) {
          if (containsStringConcat(arg.value)) {
            this.report({
              code: 'SEC006',
              category: 'sql_concat',
              severity: 'critical',
              message: `SQL string concatenation passed to '${name}' — likely SQL injection`,
              span: arg.value.span,
              suggestion: 'Use parameterized queries / prepared statements.',
            });
          }
        }
      }
    }
    this.scanExpr(expr.callee);
    for (const a of expr.args) this.scanExpr(a.value);
  }

  private checkMethodCall(expr: MethodCallExpr): void {
    const lower = expr.method.toLowerCase();

    if (WEAK_CRYPTO.has(lower)) {
      this.report({
        code: 'SEC002',
        category: 'weak_crypto',
        severity: 'high',
        message: `Cryptographically broken primitive '.${expr.method}()' in use`,
        span: expr.span,
        suggestion: 'Use SHA-256+ for hashing, AES-GCM/ChaCha20 for encryption.',
      });
    }

    if (DANGEROUS_EVAL.has(lower)) {
      const dynamic = expr.args.some(a => !isStaticString(a.value));
      this.report({
        code: 'SEC003',
        category: 'dangerous_eval',
        severity: dynamic ? 'critical' : 'medium',
        message: dynamic
          ? `'.${expr.method}()' invoked with non-literal argument — potential code/command injection`
          : `'.${expr.method}()' is a dynamic-execution sink; review whether it is needed`,
        span: expr.span,
        suggestion: 'Replace with a typed API; if unavoidable, validate inputs against an allow-list.',
      });
    }

    if (SQL_FUNCS.has(lower)) {
      for (const arg of expr.args) {
        if (containsStringConcat(arg.value)) {
          this.report({
            code: 'SEC006',
            category: 'sql_concat',
            severity: 'critical',
            message: `SQL string concatenation passed to '.${expr.method}()' — likely SQL injection`,
            span: arg.value.span,
            suggestion: 'Use parameterized queries / prepared statements.',
          });
        }
      }
    }

    this.scanExpr(expr.object);
    for (const a of expr.args) this.scanExpr(a.value);
  }

  private checkWeakRandom(name: string, span: Span): void {
    if (WEAK_RANDOM.has(name.toLowerCase())) {
      this.report({
        code: 'SEC007',
        category: 'weak_random',
        severity: 'medium',
        message: `'${name}' is not cryptographically secure`,
        span,
        suggestion: 'Use Crypto.random / SecureRandom for tokens, keys and nonces.',
      });
    }
  }

  private checkLiteralString(value: string, span: Span): void {
    // SEC004 — cleartext URL
    if (/\bhttp:\/\//i.test(value)) {
      const allowed = CLEARTEXT_ALLOWLIST.some(p => value.toLowerCase().includes(p));
      if (!allowed) {
        this.report({
          code: 'SEC004',
          category: 'insecure_url',
          severity: 'medium',
          message: 'Cleartext http:// URL — traffic is unencrypted and tamperable',
          span,
          suggestion: 'Use https:// or constrain to localhost for development only.',
        });
      }
    }
    // SEC005 — path traversal
    if (/(^|[\\/])\.\.([\\/]|$)/.test(value)) {
      this.report({
        code: 'SEC005',
        category: 'path_traversal',
        severity: 'high',
        message: 'Literal path contains a ".." segment — potential path traversal',
        span,
        suggestion: 'Canonicalize paths and validate against an allow-listed root directory.',
      });
    }
    // SEC008 — security TODO
    if (TODO_SEC_RE.test(value)) {
      this.report({
        code: 'SEC008',
        category: 'todo_security',
        severity: 'low',
        message: 'Security-related TODO/FIXME left in source',
        span,
        suggestion: 'Resolve before shipping; security TODOs become tomorrow\u2019s incidents.',
      });
    }
  }

  private checkInterpolation(expr: StringInterpolationExpr): void {
    for (const part of expr.parts) {
      if (part.kind === 'Literal') this.checkLiteralString(part.value, expr.span);
      else this.scanExpr(part.expr);
    }
  }

  // ─── Reporting ───────────────────────────────────────────────

  private report(f: Finding): void {
    this.findings.push(f);
  }
}

// ─── AST helpers ─────────────────────────────────────────────────

function calleeName(expr: Expr): string | null {
  if (expr.kind === 'Ident') return expr.name;
  if (expr.kind === 'Path') return expr.segments[expr.segments.length - 1] ?? null;
  if (expr.kind === 'FieldAccess') return expr.field;
  return null;
}

/** A static string is a plain literal with no dynamic parts. */
function isStaticString(expr: Expr): boolean {
  if (expr.kind === 'StringLiteral') return true;
  if (expr.kind === 'StringInterpolation') {
    return expr.parts.every(p => p.kind === 'Literal');
  }
  return false;
}

/**
 * True when the expression mixes a string literal with non-literal data.
 * Catches both `"SELECT ... " + name` and interpolated strings with `${expr}`.
 */
function containsStringConcat(expr: Expr): boolean {
  if (expr.kind === 'Binary' && expr.operator === '+') {
    const l = expr.left;
    const r = expr.right;
    const leftIsLit = l.kind === 'StringLiteral' || isStaticString(l);
    const rightIsLit = r.kind === 'StringLiteral' || isStaticString(r);
    if ((leftIsLit && !rightIsLit) || (!leftIsLit && rightIsLit)) return true;
    return containsStringConcat(l) || containsStringConcat(r);
  }
  if (expr.kind === 'StringInterpolation') {
    const hasLiteral = expr.parts.some(p => p.kind === 'Literal' && p.value.length > 0);
    const hasDynamic = expr.parts.some(p => p.kind === 'Expr');
    return hasLiteral && hasDynamic;
  }
  return false;
}

// ─── Scoring helper used by the audit command ────────────────────

export function severityWeight(s: Severity): number {
  switch (s) {
    case 'critical': return 5;
    case 'high':     return 3;
    case 'medium':   return 2;
    case 'low':      return 1;
    case 'info':     return 0;
  }
}
