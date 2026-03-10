/**
 * Error types and formatting for the C! compiler.
 */

import type { Span } from '../lexer/index.js';

export type Severity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  severity: Severity;
  code: string;
  message: string;
  span: Span;
  notes: string[];
  suggestion?: string | undefined;
}

// ANSI color codes
const ANSI_RED = '\x1b[31m';
const ANSI_YELLOW = '\x1b[33m';
const ANSI_CYAN = '\x1b[36m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_RESET = '\x1b[0m';

function severityColor(severity: Severity): string {
  switch (severity) {
    case 'error': return ANSI_RED;
    case 'warning': return ANSI_YELLOW;
    case 'info': return ANSI_CYAN;
  }
}

function severityLabel(severity: Severity): string {
  switch (severity) {
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'info';
  }
}

export function formatDiagnostic(diagnostic: Diagnostic, source: string, options?: { noColor?: boolean }): string {
  const { severity, code, message, span, notes, suggestion } = diagnostic;
  const noColor = options?.noColor ?? false;

  const color = noColor ? '' : severityColor(severity);
  const bold = noColor ? '' : ANSI_BOLD;
  const cyan = noColor ? '' : ANSI_CYAN;
  const reset = noColor ? '' : ANSI_RESET;

  const label = severityLabel(severity);
  const lines = source.split('\n');
  const line = lines[span.start.line - 1] ?? '';

  const lineNumStr = String(span.start.line);
  const gutter = ' '.repeat(lineNumStr.length + 1);

  let output = `${color}${bold}${label}[${code}]${reset}${bold}: ${message}${reset}\n`;
  output += `${gutter}${cyan}-->${reset} ${span.file}:${span.start.line}:${span.start.column}\n`;
  output += `${gutter}${cyan} |${reset}\n`;
  output += `${cyan}${lineNumStr.padStart(lineNumStr.length + 1)} |${reset} ${line}\n`;

  // Caret underline
  const underlineStart = span.start.column - 1;
  const underlineLen = Math.max(1,
    span.start.line === span.end.line
      ? span.end.column - span.start.column
      : line.length - underlineStart,
  );
  output += `${gutter}${cyan} |${reset} ${' '.repeat(underlineStart)}${color}${'^'.repeat(underlineLen)}${reset}\n`;

  for (const note of notes) {
    output += `${gutter}${cyan} =${reset} ${bold}note${reset}: ${note}\n`;
  }

  if (suggestion) {
    output += `${gutter}${cyan} =${reset} ${bold}suggestion${reset}: ${suggestion}\n`;
  }

  return output;
}

export function createError(
  code: string,
  message: string,
  span: Span,
  options: { notes?: string[]; suggestion?: string } = {},
): Diagnostic {
  return {
    severity: 'error',
    code,
    message,
    span,
    notes: options.notes ?? [],
    suggestion: options.suggestion,
  };
}

export function createWarning(
  code: string,
  message: string,
  span: Span,
  options: { notes?: string[]; suggestion?: string } = {},
): Diagnostic {
  return {
    severity: 'warning',
    code,
    message,
    span,
    notes: options.notes ?? [],
    suggestion: options.suggestion,
  };
}
