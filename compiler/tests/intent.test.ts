import { describe, it, expect } from 'vitest';
import { IntentChecker } from '../src/checker/intent.js';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';
import type { Diagnostic } from '../src/errors/index.js';

function checkIntent(source: string): Diagnostic[] {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const checker = new IntentChecker();
  return checker.check(program);
}

function errors(diags: Diagnostic[]) {
  return diags.filter(d => d.severity === 'error');
}

function warnings(diags: Diagnostic[]) {
  return diags.filter(d => d.severity === 'warning');
}

describe('IntentChecker', () => {
  // ─── Valid annotations ─────────────────────────────────────

  describe('valid annotations', () => {
    it('accepts function with #[intent]', () => {
      const diags = checkIntent(`
        #[intent("Greet the user by name")]
        fn greet(name: String) {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts function with #[pre] referencing params', () => {
      const diags = checkIntent(`
        #[pre(amount > 0)]
        fn transfer(amount: u64) {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts function with #[post] referencing result', () => {
      const diags = checkIntent(`
        #[post(result >= 0)]
        fn abs(x: i64) -> i64 { return x; }
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts function with #[post] referencing params and result', () => {
      const diags = checkIntent(`
        #[post(result >= principal)]
        fn interest(principal: f64, rate: f64) -> f64 { return principal; }
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts #[audit] with category and severity', () => {
      const diags = checkIntent(`
        #[audit("authentication", severity: "critical")]
        fn login(email: String) {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts #[verify] on contract', () => {
      const diags = checkIntent(`
        #[verify]
        contract Escrow {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts #[invariant] on contract', () => {
      const diags = checkIntent(`
        #[invariant(balance >= 0)]
        contract Token {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts multiple annotations on function', () => {
      const diags = checkIntent(`
        #[intent("Transfer funds between accounts")]
        #[pre(amount > 0)]
        #[post(result.is_ok())]
        #[audit("financial", severity: "critical")]
        fn transfer(amount: u64) {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts function with no annotations', () => {
      const diags = checkIntent(`
        fn helper() {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('accepts main without intent annotation', () => {
      const diags = checkIntent(`
        pub fn main() {}
      `);
      // main is special-cased — no warning
      const intentWarnings = warnings(diags).filter(d => d.message.includes('main'));
      expect(intentWarnings).toHaveLength(0);
    });
  });

  // ─── Intent validation ─────────────────────────────────────

  describe('#[intent] validation', () => {
    it('errors on empty intent string', () => {
      const diags = checkIntent(`
        #[intent("")]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('must not be empty');
    });

    it('errors on intent without quotes', () => {
      const diags = checkIntent(`
        #[intent(do something)]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('quoted string');
    });

    it('warns on very short intent', () => {
      const diags = checkIntent(`
        #[intent("Add")]
        fn add(a: i64, b: i64) -> i64 { return a; }
      `);
      expect(warnings(diags).some(d => d.message.includes('very short'))).toBe(true);
    });

    it('errors on intent with no arguments', () => {
      const diags = checkIntent(`
        #[intent]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('requires arguments');
    });
  });

  // ─── Pre-condition validation ──────────────────────────────

  describe('#[pre] validation', () => {
    it('warns when pre references unknown identifier', () => {
      const diags = checkIntent(`
        #[pre(balance > 0)]
        fn withdraw(amount: u64) {}
      `);
      const w = warnings(diags).filter(d => d.message.includes('balance'));
      expect(w).toHaveLength(1);
      expect(w[0]!.message).toContain('not a parameter');
    });

    it('does not warn for known params', () => {
      const diags = checkIntent(`
        #[pre(amount > 0)]
        fn withdraw(amount: u64) {}
      `);
      const w = warnings(diags).filter(d => d.message.includes('not a parameter'));
      expect(w).toHaveLength(0);
    });

    it('errors when pre is on a type, not function', () => {
      // pre on a type doesn't make sense, but annotations are parsed on types too
      // The checker should only encounter pre on functions via the parseAnnotations flow
      // Since types can't have #[pre] in the parser, this tests the contract case
      const diags = checkIntent(`
        #[pre(x > 0)]
        contract Foo {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('only valid on functions');
    });

    it('handles multiple pre conditions', () => {
      const diags = checkIntent(`
        #[pre(a > 0)]
        #[pre(b > 0)]
        fn multiply(a: i64, b: i64) -> i64 { return a; }
      `);
      expect(errors(diags)).toHaveLength(0);
    });

    it('allows built-in condition keywords', () => {
      const diags = checkIntent(`
        #[pre(not x.is_none())]
        fn process(x: i64) {}
      `);
      // 'not' and 'is_none' are built-in, should not trigger param warning
      const paramWarnings = warnings(diags).filter(d => d.message.includes('not a parameter'));
      expect(paramWarnings).toHaveLength(0);
    });
  });

  // ─── Post-condition validation ─────────────────────────────

  describe('#[post] validation', () => {
    it('allows result reference in post', () => {
      const diags = checkIntent(`
        #[post(result > 0)]
        fn abs(x: i64) -> i64 { return x; }
      `);
      const w = warnings(diags).filter(d => d.message.includes('not a parameter'));
      expect(w).toHaveLength(0);
    });

    it('warns on unknown identifier in post', () => {
      const diags = checkIntent(`
        #[post(total == old_total)]
        fn update(amount: u64) {}
      `);
      const w = warnings(diags).filter(d => d.message.includes('total'));
      expect(w.length).toBeGreaterThanOrEqual(1);
    });

    it('allows old() in postconditions', () => {
      const diags = checkIntent(`
        #[post(balance == old(balance) + amount)]
        fn deposit(balance: u64, amount: u64) {}
      `);
      const paramWarnings = warnings(diags).filter(d => d.message.includes('not a parameter'));
      expect(paramWarnings).toHaveLength(0);
    });
  });

  // ─── Audit validation ──────────────────────────────────────

  describe('#[audit] validation', () => {
    it('errors on audit with no args', () => {
      const diags = checkIntent(`
        #[audit]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('requires arguments');
    });

    it('errors on audit without category string', () => {
      const diags = checkIntent(`
        #[audit(severity: high)]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('category string');
    });

    it('warns on unknown severity', () => {
      const diags = checkIntent(`
        #[audit("auth", severity: "extreme")]
        fn foo() {}
      `);
      expect(warnings(diags).some(d => d.message.includes('Unknown audit severity'))).toBe(true);
    });

    it('accepts valid severities', () => {
      for (const sev of ['critical', 'high', 'medium', 'low', 'info']) {
        const diags = checkIntent(`
          #[audit("test", severity: "${sev}")]
          fn foo() {}
        `);
        expect(warnings(diags).filter(d => d.message.includes('severity'))).toHaveLength(0);
      }
    });
  });

  // ─── Placement restrictions ────────────────────────────────

  describe('placement restrictions', () => {
    it('errors on #[verify] on function', () => {
      const diags = checkIntent(`
        #[verify]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('only valid on contracts');
    });

    it('errors on #[invariant] on function', () => {
      const diags = checkIntent(`
        #[invariant(x > 0)]
        fn foo() {}
      `);
      expect(errors(diags)).toHaveLength(1);
      expect(errors(diags)[0]!.message).toContain('only valid on contracts or actors');
    });

    it('accepts #[invariant] on actor', () => {
      const diags = checkIntent(`
        #[invariant(count >= 0)]
        actor Counter {}
      `);
      expect(errors(diags)).toHaveLength(0);
    });
  });

  // ─── Unknown annotations ──────────────────────────────────

  describe('unknown annotations', () => {
    it('warns on unknown annotation', () => {
      const diags = checkIntent(`
        #[foobar]
        fn foo() {}
      `);
      expect(warnings(diags)).toHaveLength(1);
      expect(warnings(diags)[0]!.message).toContain("Unknown annotation '#[foobar]'");
    });

    it('suggests known annotations', () => {
      const diags = checkIntent(`
        #[unknown_thing]
        fn foo() {}
      `);
      expect(warnings(diags)[0]!.suggestion).toContain('intent');
    });
  });

  // ─── Duplicate detection ──────────────────────────────────

  describe('duplicate detection', () => {
    it('warns on duplicate #[intent]', () => {
      const diags = checkIntent(`
        #[intent("First description")]
        #[intent("Second description")]
        fn foo() {}
      `);
      expect(warnings(diags).some(d => d.message.includes('Duplicate'))).toBe(true);
    });

    it('allows multiple #[pre] conditions', () => {
      const diags = checkIntent(`
        #[pre(a > 0)]
        #[pre(b > 0)]
        fn add(a: i64, b: i64) -> i64 { return a; }
      `);
      expect(warnings(diags).filter(d => d.message.includes('Duplicate'))).toHaveLength(0);
    });
  });

  // ─── Public function warnings ─────────────────────────────

  describe('public function intent warnings', () => {
    it('warns on public function without intent', () => {
      const diags = checkIntent(`
        pub fn process(data: String) {}
      `);
      expect(warnings(diags).some(d => d.message.includes('lacks an #[intent]'))).toBe(true);
    });

    it('does not warn on private function without intent', () => {
      const diags = checkIntent(`
        fn helper() {}
      `);
      expect(warnings(diags).filter(d => d.message.includes('lacks an #[intent]'))).toHaveLength(0);
    });

    it('does not warn on public function with intent', () => {
      const diags = checkIntent(`
        #[intent("Process incoming data")]
        pub fn process(data: String) {}
      `);
      expect(warnings(diags).filter(d => d.message.includes('lacks an #[intent]'))).toHaveLength(0);
    });
  });

  // ─── #[verify] validation ─────────────────────────────────

  describe('#[verify] validation', () => {
    it('warns if verify has arguments', () => {
      const diags = checkIntent(`
        #[verify(true)]
        contract Foo {}
      `);
      expect(warnings(diags).some(d => d.message.includes('does not take arguments'))).toBe(true);
    });
  });

  // ─── Error codes ──────────────────────────────────────────

  describe('error codes', () => {
    it('uses E_INTENT for errors', () => {
      const diags = checkIntent(`
        #[intent]
        fn foo() {}
      `);
      expect(errors(diags)[0]!.code).toBe('E_INTENT');
    });

    it('uses W_INTENT for warnings', () => {
      const diags = checkIntent(`
        #[unknown_annotation]
        fn foo() {}
      `);
      expect(warnings(diags)[0]!.code).toBe('W_INTENT');
    });
  });
});
