import { describe, it, expect } from 'vitest';
import { LlvmGenerator } from '../src/codegen/llvmgen.js';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';

function generateLlvm(source: string): string {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const gen = new LlvmGenerator();
  return gen.generate(program);
}

describe('LlvmGenerator', () => {
  describe('module structure', () => {
    it('generates LLVM IR with define for main', () => {
      const ir = generateLlvm('fn main() {}');
      expect(ir).toContain('define');
      expect(ir).toContain('@main');
    });

    it('declares printf extern', () => {
      const ir = generateLlvm(`
        fn main() {
          println("hello");
        }
      `);
      expect(ir).toContain('declare');
      expect(ir).toContain('@printf');
    });
  });

  describe('variables and arithmetic', () => {
    it('generates let binding with alloca', () => {
      const ir = generateLlvm(`fn main() { let x: i64 = 42; }`);
      expect(ir).toContain('alloca i64');
      expect(ir).toContain('store i64 42');
    });

    it('generates arithmetic operations', () => {
      const ir = generateLlvm(`fn add(a: i64, b: i64) -> i64 { return a + b; }`);
      expect(ir).toContain('add i64');
      expect(ir).toContain('ret i64');
    });

    it('generates println as printf call', () => {
      const ir = generateLlvm(`fn main() { println("Hello LLVM!"); }`);
      expect(ir).toContain('@printf');
      expect(ir).toContain('Hello LLVM!');
    });

    it('generates mutable variables', () => {
      const ir = generateLlvm(`fn main() { let mut x: i64 = 0; x = 42; }`);
      expect(ir).toContain('alloca i64');
      expect(ir).toContain('store i64 42');
    });
  });

  describe('control flow', () => {
    it('generates if/else with basic blocks', () => {
      const ir = generateLlvm(`fn main() { if true { println("yes"); } else { println("no"); } }`);
      expect(ir).toContain('br i1');
    });

    it('generates while loop', () => {
      const ir = generateLlvm(`fn main() { let mut i: i64 = 0; while i < 10 { i = i + 1; } }`);
      expect(ir).toContain('br label');
      expect(ir).toContain('icmp slt');
    });

    it('generates match as switch', () => {
      const ir = generateLlvm(`fn check(x: i64) { match x { 1 => println("one"), _ => println("other"), } }`);
      expect(ir).toContain('switch i64');
    });
  });

  describe('structs and enums', () => {
    it('generates LLVM struct type', () => {
      const ir = generateLlvm(`type Point { x: i64, y: i64 } fn main() { let p = Point { x: 10, y: 20 }; }`);
      expect(ir).toContain('%Point = type');
    });

    it('generates enum as constants', () => {
      const ir = generateLlvm(`enum Color { Red, Green, Blue } fn main() { let c = Red; }`);
      expect(ir).toContain('store i64 0'); // Red = tag 0
    });
  });

  describe('closures', () => {
    it('generates closure as separate function', () => {
      const ir = generateLlvm(`fn main() { let double = |x: i64| -> i64 { return x * 2; }; }`);
      expect(ir).toContain('define i64 @__closure');
    });
  });

  describe('actors', () => {
    it('generates actor as struct with methods', () => {
      const ir = generateLlvm(`
        actor Counter {
          state count: i64 = 0;
          on Increment() { count = count + 1; }
        }
        fn main() {}
      `);
      expect(ir).toContain('%Counter = type');
    });
  });

  describe('floats and remaining', () => {
    it('generates f64 operations', () => {
      const ir = generateLlvm(`fn main() { let x: f64 = 3.14; let y: f64 = x * 2.0; }`);
      expect(ir).toContain('double');
    });

    it('generates function calls', () => {
      const ir = generateLlvm(`fn add(a: i64, b: i64) -> i64 { return a + b; } fn main() { let r: i64 = add(1, 2); }`);
      expect(ir).toContain('call i64 @add');
    });
  });
});
