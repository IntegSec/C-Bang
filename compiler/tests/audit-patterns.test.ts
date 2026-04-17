import { describe, it, expect } from 'vitest';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';
import { scanPatterns } from '../src/audit/patterns.js';
import type { Finding } from '../src/audit/patterns.js';

function scan(source: string): Finding[] {
  const tokens = new Lexer(source, 'test.cb').tokenize();
  const { program } = new Parser(tokens).parse();
  return scanPatterns(program);
}

function codes(findings: Finding[]): string[] {
  return findings.map(f => f.code);
}

describe('audit pattern scanner', () => {
  // ─── SEC001 hardcoded secret ──────────────────────────────────

  describe('SEC001 hardcoded secret', () => {
    it('flags a string literal bound to a credential-named variable', () => {
      const findings = scan(`
        fn login() {
          let api_key: String = "sk_live_abcdefghij";
        }
      `);
      expect(codes(findings)).toContain('SEC001');
      const f = findings.find(x => x.code === 'SEC001')!;
      expect(f.severity).toBe('high');
    });

    it('flags assignment to a credential-named field', () => {
      const findings = scan(`
        fn cfg() {
          config.password = "supersecret123";
        }
      `);
      expect(codes(findings)).toContain('SEC001');
    });

    it('flags credential in a struct field', () => {
      const findings = scan(`
        fn make() {
          let c: Config = Config { client_secret: "xyzxyzxyzxyz" };
        }
      `);
      expect(codes(findings)).toContain('SEC001');
    });

    it('does not flag short or placeholder values', () => {
      const findings = scan(`
        fn skip() {
          let password: String = "changeme";
          let api_key: String = "todo";
        }
      `);
      expect(codes(findings)).not.toContain('SEC001');
    });

    it('does not flag non-credential variable names', () => {
      const findings = scan(`
        fn ok() {
          let greeting: String = "Hello world!";
        }
      `);
      expect(codes(findings)).not.toContain('SEC001');
    });
  });

  // ─── SEC002 weak crypto ───────────────────────────────────────

  describe('SEC002 weak crypto', () => {
    it('flags an md5 call', () => {
      const findings = scan(`
        fn hash() {
          let h: String = md5("hello");
        }
      `);
      expect(codes(findings)).toContain('SEC002');
    });

    it('flags a .sha1() method call', () => {
      const findings = scan(`
        fn hash(data: Bytes) {
          let h: Bytes = data.sha1();
        }
      `);
      expect(codes(findings)).toContain('SEC002');
    });

    it('does not flag sha256', () => {
      const findings = scan(`
        fn hash() {
          let h: String = sha256("hello");
        }
      `);
      expect(codes(findings)).not.toContain('SEC002');
    });
  });

  // ─── SEC003 dangerous eval ────────────────────────────────────

  describe('SEC003 dangerous eval', () => {
    it('marks eval with non-literal argument as critical', () => {
      const findings = scan(`
        fn run(input: String) {
          eval(input);
        }
      `);
      const f = findings.find(x => x.code === 'SEC003');
      expect(f).toBeDefined();
      expect(f!.severity).toBe('critical');
    });

    it('marks system() with literal as medium (still flagged)', () => {
      const findings = scan(`
        fn boot() {
          system("ls");
        }
      `);
      const f = findings.find(x => x.code === 'SEC003');
      expect(f).toBeDefined();
      expect(f!.severity).toBe('medium');
    });
  });

  // ─── SEC004 cleartext URL ─────────────────────────────────────

  describe('SEC004 insecure URL', () => {
    it('flags an http:// URL literal', () => {
      const findings = scan(`
        fn req() {
          let url: String = "http://api.example.net/login";
        }
      `);
      expect(codes(findings)).toContain('SEC004');
    });

    it('does not flag https://', () => {
      const findings = scan(`
        fn req() {
          let url: String = "https://api.example.net/login";
        }
      `);
      expect(codes(findings)).not.toContain('SEC004');
    });

    it('does not flag http://localhost', () => {
      const findings = scan(`
        fn req() {
          let url: String = "http://localhost:8080";
        }
      `);
      expect(codes(findings)).not.toContain('SEC004');
    });
  });

  // ─── SEC005 path traversal ────────────────────────────────────

  describe('SEC005 path traversal', () => {
    it('flags a literal containing ..', () => {
      const findings = scan(`
        fn read() {
          let p: String = "../../etc/passwd";
        }
      `);
      expect(codes(findings)).toContain('SEC005');
    });

    it('does not flag a normal path', () => {
      const findings = scan(`
        fn read() {
          let p: String = "data/users.json";
        }
      `);
      expect(codes(findings)).not.toContain('SEC005');
    });
  });

  // ─── SEC006 SQL concatenation ─────────────────────────────────

  describe('SEC006 SQL concat', () => {
    it('flags string concat passed to query()', () => {
      const findings = scan(`
        fn list(name: String) {
          query("SELECT * FROM users WHERE name = '" + name + "'");
        }
      `);
      expect(codes(findings)).toContain('SEC006');
    });

    it('flags string concat passed via .execute()', () => {
      const findings = scan(`
        fn list(name: String) {
          db.execute("SELECT * FROM users WHERE name = '" + name + "'");
        }
      `);
      expect(codes(findings)).toContain('SEC006');
    });

    it('flags interpolated SQL string', () => {
      const findings = scan(`
        fn list(name: String) {
          query("SELECT * FROM users WHERE name = '\${name}'");
        }
      `);
      expect(codes(findings)).toContain('SEC006');
    });

    it('does not flag a static SQL literal', () => {
      const findings = scan(`
        fn list() {
          query("SELECT * FROM users");
        }
      `);
      expect(codes(findings)).not.toContain('SEC006');
    });
  });

  // ─── SEC007 weak random ───────────────────────────────────────

  describe('SEC007 weak random', () => {
    it('flags a bare rand call', () => {
      const findings = scan(`
        fn token() {
          let t: i64 = rand();
        }
      `);
      expect(codes(findings)).toContain('SEC007');
    });
  });

  // ─── SEC008 security TODO ─────────────────────────────────────

  describe('SEC008 security TODO', () => {
    it('flags TODO/FIXME mentioning security keywords', () => {
      const findings = scan(`
        fn note() {
          let msg: String = "TODO: sanitize the user input before saving";
        }
      `);
      expect(codes(findings)).toContain('SEC008');
    });

    it('does not flag generic TODOs', () => {
      const findings = scan(`
        fn note() {
          let msg: String = "TODO: refactor this later";
        }
      `);
      expect(codes(findings)).not.toContain('SEC008');
    });
  });

  // ─── Coverage / structure ─────────────────────────────────────

  describe('AST coverage', () => {
    it('returns no findings for clean code', () => {
      const findings = scan(`
        fn add(a: i64, b: i64) -> i64 {
          return a + b;
        }
      `);
      expect(findings).toHaveLength(0);
    });

    it('walks into actor handlers', () => {
      const findings = scan(`
        actor Auth {
          on login(pw: String) {
            let h: String = md5(pw);
          }
        }
      `);
      expect(codes(findings)).toContain('SEC002');
    });

    it('walks into contract methods', () => {
      const findings = scan(`
        contract Token {
          fn check() {
            eval("dangerous");
          }
        }
      `);
      expect(codes(findings)).toContain('SEC003');
    });

    it('produces deterministic ordering by file position', () => {
      const findings = scan(`
        fn first() {
          let api_key: String = "AAAAAAAA12345";
        }
        fn second() {
          let password: String = "BBBBBBBB67890";
        }
      `);
      const lines = findings.filter(f => f.code === 'SEC001').map(f => f.span.start.line);
      expect(lines).toEqual([...lines].sort((a, b) => a - b));
    });
  });
});
