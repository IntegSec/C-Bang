import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../src/lexer/index.js';

function lex(source: string) {
  return new Lexer(source, 'test.cb').tokenize();
}

function tokenTypes(source: string): TokenType[] {
  return lex(source)
    .filter(t => t.type !== TokenType.Comment && t.type !== TokenType.EOF)
    .map(t => t.type);
}

function tokenValues(source: string): string[] {
  return lex(source)
    .filter(t => t.type !== TokenType.Comment && t.type !== TokenType.EOF)
    .map(t => t.value);
}

describe('Lexer', () => {
  describe('keywords', () => {
    it('recognizes all keywords', () => {
      const keywords = [
        'fn', 'let', 'type', 'actor', 'contract', 'server', 'component',
        'state', 'on', 'match', 'if', 'else', 'for', 'in', 'return',
        'reply', 'spawn', 'deploy', 'emit', 'pub', 'use', 'mod',
        'own', 'shared', 'scope', 'parallel', 'supervise', 'init',
        'with', 'pure', 'async', 'await', 'mut',
      ];

      for (const kw of keywords) {
        const tokens = lex(kw);
        expect(tokens[0]!.type).toBe(kw);
        expect(tokens[0]!.value).toBe(kw);
      }
    });

    it('recognizes true and false as bool literals', () => {
      expect(tokenTypes('true false')).toEqual([
        TokenType.BoolLiteral,
        TokenType.BoolLiteral,
      ]);
    });
  });

  describe('identifiers', () => {
    it('lexes regular identifiers', () => {
      const tokens = lex('foo bar_baz _private');
      expect(tokenTypes('foo bar_baz _private')).toEqual([
        TokenType.Identifier,
        TokenType.Identifier,
        TokenType.Identifier,
      ]);
    });

    it('lexes PascalCase as TypeIdentifier', () => {
      expect(tokenTypes('User HashMap MyActor')).toEqual([
        TokenType.TypeIdentifier,
        TokenType.TypeIdentifier,
        TokenType.TypeIdentifier,
      ]);
    });

    it('distinguishes identifiers from keywords', () => {
      expect(tokenTypes('fn foo')).toEqual([TokenType.Fn, TokenType.Identifier]);
    });
  });

  describe('integers', () => {
    it('lexes decimal integers', () => {
      expect(tokenTypes('42')).toEqual([TokenType.IntLiteral]);
      expect(tokenValues('42')[0]).toBe('42');
    });

    it('lexes integers with underscores', () => {
      expect(tokenValues('1_000_000')[0]).toBe('1_000_000');
    });

    it('lexes hex integers', () => {
      expect(tokenValues('0xff')[0]).toBe('0xff');
      expect(tokenTypes('0xFF')).toEqual([TokenType.IntLiteral]);
    });

    it('lexes binary integers', () => {
      expect(tokenValues('0b1010')[0]).toBe('0b1010');
      expect(tokenTypes('0b1010')).toEqual([TokenType.IntLiteral]);
    });
  });

  describe('floats', () => {
    it('lexes decimal floats', () => {
      expect(tokenTypes('3.14')).toEqual([TokenType.FloatLiteral]);
      expect(tokenValues('3.14')[0]).toBe('3.14');
    });

    it('lexes scientific notation', () => {
      expect(tokenTypes('1.0e10')).toEqual([TokenType.FloatLiteral]);
      expect(tokenValues('1.5e-3')[0]).toBe('1.5e-3');
    });
  });

  describe('strings', () => {
    it('lexes simple strings', () => {
      expect(tokenTypes('"hello"')).toEqual([TokenType.StringLiteral]);
      expect(tokenValues('"hello"')[0]).toBe('hello');
    });

    it('handles escape sequences', () => {
      expect(tokenValues('"hello\\nworld"')[0]).toBe('hello\nworld');
      expect(tokenValues('"tab\\there"')[0]).toBe('tab\there');
      expect(tokenValues('"quote\\"here"')[0]).toBe('quote"here');
    });

    it('reports unterminated strings as errors', () => {
      expect(tokenTypes('"unterminated')).toEqual([TokenType.Error]);
    });
  });

  describe('operators', () => {
    it('lexes single-char operators', () => {
      expect(tokenTypes('+ - * / %')).toEqual([
        TokenType.Plus, TokenType.Minus, TokenType.Star,
        TokenType.Slash, TokenType.Percent,
      ]);
    });

    it('lexes comparison operators', () => {
      expect(tokenTypes('== != < > <= >=')).toEqual([
        TokenType.Eq, TokenType.NotEq, TokenType.Lt,
        TokenType.Gt, TokenType.LtEq, TokenType.GtEq,
      ]);
    });

    it('lexes logical operators', () => {
      expect(tokenTypes('&& || !')).toEqual([
        TokenType.And, TokenType.Or, TokenType.Not,
      ]);
    });

    it('lexes assignment operators', () => {
      expect(tokenTypes('= += -=')).toEqual([
        TokenType.Assign, TokenType.PlusAssign, TokenType.MinusAssign,
      ]);
    });

    it('lexes arrow operators', () => {
      expect(tokenTypes('-> =>')).toEqual([TokenType.Arrow, TokenType.FatArrow]);
    });

    it('lexes range operators', () => {
      expect(tokenTypes('.. ..=')).toEqual([TokenType.DotDot, TokenType.DotDotEq]);
    });

    it('lexes double colon', () => {
      expect(tokenTypes('::')).toEqual([TokenType.ColonColon]);
    });
  });

  describe('delimiters', () => {
    it('lexes all delimiter types', () => {
      expect(tokenTypes('( ) { } [ ] , : ;')).toEqual([
        TokenType.LeftParen, TokenType.RightParen,
        TokenType.LeftBrace, TokenType.RightBrace,
        TokenType.LeftBracket, TokenType.RightBracket,
        TokenType.Comma, TokenType.Colon, TokenType.Semicolon,
      ]);
    });
  });

  describe('comments', () => {
    it('lexes line comments', () => {
      const tokens = lex('foo // this is a comment\nbar');
      const nonComment = tokens.filter(t =>
        t.type !== TokenType.Comment && t.type !== TokenType.EOF,
      );
      expect(nonComment.map(t => t.value)).toEqual(['foo', 'bar']);
    });

    it('lexes block comments', () => {
      const tokens = lex('foo /* block comment */ bar');
      const nonComment = tokens.filter(t =>
        t.type !== TokenType.Comment && t.type !== TokenType.EOF,
      );
      expect(nonComment.map(t => t.value)).toEqual(['foo', 'bar']);
    });

    it('handles nested block comments', () => {
      const tokens = lex('foo /* outer /* inner */ still comment */ bar');
      const nonComment = tokens.filter(t =>
        t.type !== TokenType.Comment && t.type !== TokenType.EOF,
      );
      expect(nonComment.map(t => t.value)).toEqual(['foo', 'bar']);
    });
  });

  describe('annotations', () => {
    it('lexes simple annotations', () => {
      const tokens = lex('#[pub]');
      expect(tokens[0]!.type).toBe(TokenType.Annotation);
      expect(tokens[0]!.value).toBe('#[pub]');
    });

    it('lexes annotations with arguments', () => {
      const tokens = lex('#[get("/users/:id")]');
      expect(tokens[0]!.type).toBe(TokenType.Annotation);
    });

    it('lexes intent annotations', () => {
      const tokens = lex('#[intent("Transfer tokens between accounts")]');
      expect(tokens[0]!.type).toBe(TokenType.Annotation);
      expect(tokens[0]!.value).toContain('intent');
    });
  });

  describe('position tracking', () => {
    it('tracks line and column', () => {
      const tokens = lex('foo\nbar');
      const foo = tokens[0]!;
      const bar = tokens[1]!;
      expect(foo.span.start.line).toBe(1);
      expect(foo.span.start.column).toBe(1);
      expect(bar.span.start.line).toBe(2);
      expect(bar.span.start.column).toBe(1);
    });
  });

  describe('real C! code', () => {
    it('lexes a simple function', () => {
      const source = `fn main() {
    print("Hello from C!");
}`;
      const tokens = lex(source);
      const types = tokens
        .filter(t => t.type !== TokenType.Comment && t.type !== TokenType.EOF)
        .map(t => t.type);

      expect(types).toEqual([
        TokenType.Fn,
        TokenType.Identifier, // main
        TokenType.LeftParen,
        TokenType.RightParen,
        TokenType.LeftBrace,
        TokenType.Identifier, // print
        TokenType.LeftParen,
        TokenType.StringLiteral,
        TokenType.RightParen,
        TokenType.Semicolon,
        TokenType.RightBrace,
      ]);
    });

    it('lexes a type declaration with refinement', () => {
      const source = 'type Port = u16{1..65535}';
      const types = tokenTypes(source);
      expect(types).toEqual([
        TokenType.Type,
        TokenType.TypeIdentifier, // Port
        TokenType.Assign,
        TokenType.Identifier, // u16
        TokenType.LeftBrace,
        TokenType.IntLiteral, // 1
        TokenType.DotDot,
        TokenType.IntLiteral, // 65535
        TokenType.RightBrace,
      ]);
    });

    it('lexes an actor declaration', () => {
      const source = `actor Counter {
    state count: i64 = 0

    on Increment(by: i64) {
        count += by;
    }
}`;
      const tokens = lex(source);
      const errors = tokens.filter(t => t.type === TokenType.Error);
      expect(errors).toHaveLength(0);
    });

    it('lexes annotations with pre/post conditions', () => {
      const source = `#[pre(balances[from] >= amount)]
#[post(balances[to] == old(balances[to]) + amount)]
fn transfer(from: Address, to: Address, amount: u256) -> Result<Receipt> {}`;
      const tokens = lex(source);
      const errors = tokens.filter(t => t.type === TokenType.Error);
      expect(errors).toHaveLength(0);
    });
  });
});
