import { describe, it, expect } from 'vitest';
import { formatDiagnostic, createError, createWarning, Diagnostic } from '../src/errors/index.js';
import type { Span } from '../src/lexer/index.js';

function makeSpan(file: string, startLine: number, startCol: number, endLine: number, endCol: number): Span {
  return {
    start: { line: startLine, column: startCol, offset: 0 },
    end: { line: endLine, column: endCol, offset: 0 },
    file,
  };
}

describe('formatDiagnostic', () => {
  const source = 'fn main() {\n  let x: i32 = "hello";\n}';

  it('includes the source line and caret indicator', () => {
    const span = makeSpan('test.cb', 2, 16, 2, 23);
    const diag = createError('T001', 'Type mismatch: expected i32, got String', span);
    const output = formatDiagnostic(diag, source, { noColor: true });

    expect(output).toContain('error[T001]');
    expect(output).toContain('Type mismatch: expected i32, got String');
    expect(output).toContain('--> test.cb:2:16');
    expect(output).toContain('let x: i32 = "hello";');
    expect(output).toContain('^^^^^^^');
  });

  it('shows notes and suggestions', () => {
    const span = makeSpan('test.cb', 1, 1, 1, 3);
    const diag = createError('E001', 'Undefined variable', span, {
      notes: ['Did you mean to declare it?'],
      suggestion: 'Add a let binding',
    });
    const output = formatDiagnostic(diag, source, { noColor: true });

    expect(output).toContain('= note: Did you mean to declare it?');
    expect(output).toContain('= suggestion: Add a let binding');
  });

  it('formats warnings differently from errors', () => {
    const span = makeSpan('test.cb', 1, 1, 1, 3);
    const diag = createWarning('W001', 'Unused variable', span);
    const output = formatDiagnostic(diag, source, { noColor: true });

    expect(output).toContain('warning[W001]');
  });

  it('includes ANSI color codes by default', () => {
    const span = makeSpan('test.cb', 1, 1, 1, 3);
    const diag = createError('E001', 'Test error', span);
    const output = formatDiagnostic(diag, source);

    // Should contain ANSI red for errors
    expect(output).toContain('\x1b[31m');
    // Should contain ANSI reset
    expect(output).toContain('\x1b[0m');
  });

  it('omits ANSI codes when noColor is true', () => {
    const span = makeSpan('test.cb', 1, 1, 1, 3);
    const diag = createError('E001', 'Test error', span);
    const output = formatDiagnostic(diag, source, { noColor: true });

    expect(output).not.toContain('\x1b[');
  });

  it('handles single-character spans', () => {
    const span = makeSpan('test.cb', 1, 1, 1, 2);
    const diag = createError('E001', 'Unexpected token', span);
    const output = formatDiagnostic(diag, source, { noColor: true });

    expect(output).toContain('^');
  });

  it('handles multi-digit line numbers with correct gutter alignment', () => {
    const longSource = Array(100).fill('let x = 1;').join('\n');
    const span = makeSpan('test.cb', 100, 5, 100, 10);
    const diag = createError('E001', 'Error on line 100', span);
    const output = formatDiagnostic(diag, longSource, { noColor: true });

    expect(output).toContain('--> test.cb:100:5');
    expect(output).toContain('100 |');
  });
});
