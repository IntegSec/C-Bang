/**
 * C! (C-Bang) Compiler
 *
 * The first programming language designed for AI-human collaboration
 * with security by construction.
 */

export { Lexer, Token, TokenType } from './lexer/index.js';
export { formatDiagnostic, createError, createWarning } from './errors/index.js';

export const VERSION = '0.1.0';
