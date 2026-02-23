import { describe, it, expect } from 'vitest';
import { Type, PRIMITIVES, typeEquals, typeToString } from '../src/checker/types.js';
import { Environment } from '../src/checker/environment.js';
import { registerBuiltins } from '../src/checker/builtins.js';

describe('Type representations', () => {
  it('has all primitive types', () => {
    expect(PRIMITIVES.has('i32')).toBe(true);
    expect(PRIMITIVES.has('bool')).toBe(true);
    expect(PRIMITIVES.has('String')).toBe(true);
    expect(PRIMITIVES.has('u256')).toBe(true);
  });

  it('compares primitive types', () => {
    const i32: Type = { kind: 'Primitive', name: 'i32' };
    const i32b: Type = { kind: 'Primitive', name: 'i32' };
    const bool: Type = { kind: 'Primitive', name: 'bool' };
    expect(typeEquals(i32, i32b)).toBe(true);
    expect(typeEquals(i32, bool)).toBe(false);
  });

  it('compares unit types', () => {
    expect(typeEquals({ kind: 'Unit' }, { kind: 'Unit' })).toBe(true);
  });

  it('formats types as strings', () => {
    expect(typeToString({ kind: 'Primitive', name: 'i32' })).toBe('i32');
    expect(typeToString({ kind: 'Unit' })).toBe('()');
    expect(typeToString({ kind: 'Unknown' })).toBe('<unknown>');
    expect(typeToString({ kind: 'Never' })).toBe('never');
    expect(typeToString({
      kind: 'Function',
      params: [{ kind: 'Primitive', name: 'i32' }],
      ret: { kind: 'Primitive', name: 'bool' },
    })).toBe('fn(i32) -> bool');
  });

  it('compares struct types by name', () => {
    const a: Type = { kind: 'Struct', name: 'User', fields: new Map([['id', { kind: 'Primitive', name: 'i32' }]]) };
    const b: Type = { kind: 'Struct', name: 'User', fields: new Map([['id', { kind: 'Primitive', name: 'i32' }]]) };
    const c: Type = { kind: 'Struct', name: 'Post', fields: new Map() };
    expect(typeEquals(a, b)).toBe(true);
    expect(typeEquals(a, c)).toBe(false);
  });

  it('compares generic types', () => {
    const a: Type = { kind: 'Generic', name: 'Vec', args: [{ kind: 'Primitive', name: 'i32' }] };
    const b: Type = { kind: 'Generic', name: 'Vec', args: [{ kind: 'Primitive', name: 'i32' }] };
    const c: Type = { kind: 'Generic', name: 'Vec', args: [{ kind: 'Primitive', name: 'bool' }] };
    expect(typeEquals(a, b)).toBe(true);
    expect(typeEquals(a, c)).toBe(false);
  });
});

describe('Environment', () => {
  it('defines and looks up variables', () => {
    const env = new Environment();
    const i32: Type = { kind: 'Primitive', name: 'i32' };
    env.define('x', i32);
    expect(env.lookup('x')).toEqual(i32);
  });

  it('returns undefined for missing variables', () => {
    const env = new Environment();
    expect(env.lookup('x')).toBeUndefined();
  });

  it('scopes variables with enter/leave', () => {
    const env = new Environment();
    const i32: Type = { kind: 'Primitive', name: 'i32' };
    env.define('x', i32);
    env.enter();
    env.define('y', i32);
    expect(env.lookup('x')).toEqual(i32);
    expect(env.lookup('y')).toEqual(i32);
    env.leave();
    expect(env.lookup('y')).toBeUndefined();
    expect(env.lookup('x')).toEqual(i32);
  });

  it('shadows variables in inner scope', () => {
    const env = new Environment();
    env.define('x', { kind: 'Primitive', name: 'i32' });
    env.enter();
    env.define('x', { kind: 'Primitive', name: 'bool' });
    expect(env.lookup('x')).toEqual({ kind: 'Primitive', name: 'bool' });
    env.leave();
    expect(env.lookup('x')).toEqual({ kind: 'Primitive', name: 'i32' });
  });

  it('defines and looks up types', () => {
    const env = new Environment();
    const userType: Type = { kind: 'Struct', name: 'User', fields: new Map() };
    env.defineType('User', userType);
    expect(env.lookupType('User')).toEqual(userType);
  });

  it('scopes types with enter/leave', () => {
    const env = new Environment();
    env.defineType('Outer', { kind: 'Struct', name: 'Outer', fields: new Map() });
    env.enter();
    env.defineType('Inner', { kind: 'Struct', name: 'Inner', fields: new Map() });
    expect(env.lookupType('Outer')).toBeDefined();
    expect(env.lookupType('Inner')).toBeDefined();
    env.leave();
    expect(env.lookupType('Inner')).toBeUndefined();
  });
});

describe('Builtins', () => {
  it('registers primitive types', () => {
    const env = new Environment();
    registerBuiltins(env);
    expect(env.lookupType('i32')).toEqual({ kind: 'Primitive', name: 'i32' });
    expect(env.lookupType('bool')).toEqual({ kind: 'Primitive', name: 'bool' });
    expect(env.lookupType('String')).toEqual({ kind: 'Primitive', name: 'String' });
  });

  it('registers print function', () => {
    const env = new Environment();
    registerBuiltins(env);
    const print = env.lookup('print');
    expect(print).toBeDefined();
    expect(print!.kind).toBe('Function');
  });
});
