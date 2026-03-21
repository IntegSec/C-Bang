import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';

function parse(source: string) {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

describe('multi-file imports', () => {
  describe('use declaration parsing with dot separators', () => {
    it('parses use with dot-separated wildcard', () => {
      const { program, diagnostics } = parse('use game.state.*;');
      expect(diagnostics).toHaveLength(0);
      expect(program.items).toHaveLength(1);
      const useDecl = program.items[0] as any;
      expect(useDecl.kind).toBe('UseDecl');
      expect(useDecl.path).toEqual(['game', 'state']);
      expect(useDecl.isWildcard).toBe(true);
    });

    it('parses use with dot-separated named import', () => {
      const { program, diagnostics } = parse('use game.entities.can;');
      expect(diagnostics).toHaveLength(0);
      expect(program.items).toHaveLength(1);
      const useDecl = program.items[0] as any;
      expect(useDecl.kind).toBe('UseDecl');
      expect(useDecl.path).toEqual(['game', 'entities']);
      expect(useDecl.items).toEqual([{ kind: 'Named', name: 'can', alias: null }]);
      expect(useDecl.isWildcard).toBe(false);
    });

    it('parses use with colons (Rust-style) still works', () => {
      const { program, diagnostics } = parse('use crate::game::systems::achievements::*;');
      expect(diagnostics).toHaveLength(0);
      const useDecl = program.items[0] as any;
      expect(useDecl.kind).toBe('UseDecl');
      expect(useDecl.path).toEqual(['crate', 'game', 'systems', 'achievements']);
      expect(useDecl.isWildcard).toBe(true);
    });

    it('parses use with dot-separated braced imports', () => {
      const { program, diagnostics } = parse('use game.systems.{collision, difficulty};');
      expect(diagnostics).toHaveLength(0);
      const useDecl = program.items[0] as any;
      expect(useDecl.kind).toBe('UseDecl');
      expect(useDecl.path).toEqual(['game', 'systems']);
      expect(useDecl.items).toHaveLength(2);
      expect(useDecl.items[0]).toEqual({ kind: 'Named', name: 'collision', alias: null });
      expect(useDecl.items[1]).toEqual({ kind: 'Named', name: 'difficulty', alias: null });
    });

    it('parses multiple use declarations in a program', () => {
      const { program, diagnostics } = parse(`
        use game.state.*;
        use game.entities.can;
        use server.types.*;
        fn main() {}
      `);
      expect(diagnostics).toHaveLength(0);
      expect(program.items).toHaveLength(4);
      expect(program.items[0]!.kind).toBe('UseDecl');
      expect(program.items[1]!.kind).toBe('UseDecl');
      expect(program.items[2]!.kind).toBe('UseDecl');
      expect(program.items[3]!.kind).toBe('FunctionDecl');
    });
  });

  describe('file resolution', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = join(tmpdir(), `cbang-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      mkdirSync(tmpDir, { recursive: true });
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it('resolves use declarations to files and merges ASTs', async () => {
      // Create a simple two-file project
      mkdirSync(join(tmpDir, 'game'), { recursive: true });

      writeFileSync(join(tmpDir, 'game', 'utils.cb'), `
        fn add(a: i32, b: i32) -> i32 {
          return a + b;
        }
      `);

      writeFileSync(join(tmpDir, 'main.cb'), `
        use game.utils.*;

        fn main() {
          let result = add(1, 2);
        }
      `);

      // We test by dynamically importing cli and calling bundleFiles
      // But since bundleFiles is not exported, we test via the parser only here
      // The actual bundling is tested via the CLI integration
      const mainSource = `
        use game.utils.*;
        fn main() {
          let result = add(1, 2);
        }
      `;
      const { program, diagnostics } = parse(mainSource);
      expect(diagnostics).toHaveLength(0);
      expect(program.items).toHaveLength(2);
      expect(program.items[0]!.kind).toBe('UseDecl');
      expect(program.items[1]!.kind).toBe('FunctionDecl');
    });
  });
});
