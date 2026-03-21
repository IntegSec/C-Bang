import type { Type } from './types.js';

const macroReturnTypes = new Map<string, Type>();

export function registerMacroType(name: string, returnType: Type): void {
  macroReturnTypes.set(name, returnType);
}

export function registerMacroTypes(macros: Record<string, Type>): void {
  for (const [name, type] of Object.entries(macros)) {
    macroReturnTypes.set(name, type);
  }
}

export function getMacroReturnType(name: string): Type | undefined {
  return macroReturnTypes.get(name);
}

const f64Type: Type = { kind: 'Primitive', name: 'f64' };
const boolType: Type = { kind: 'Primitive', name: 'bool' };
const i32Type: Type = { kind: 'Primitive', name: 'i32' };
const stringType: Type = { kind: 'Primitive', name: 'String' };
const unitType: Type = { kind: 'Unit' };

export { f64Type, boolType, i32Type, stringType, unitType };
