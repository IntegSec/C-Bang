import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes } from '../../checker/macro-types.js';
import { f64Type } from '../../checker/macro-types.js';

const mathMacros: Record<string, (args: string, rawArgs: string[]) => string> = {
  math_sin: (args) => `Math.sin(${args})`,
  math_cos: (args) => `Math.cos(${args})`,
  math_sqrt: (args) => `Math.sqrt(${args})`,
  math_floor: (args) => `Math.floor(${args})`,
  math_abs: (args) => `Math.abs(${args})`,
  math_tan: (args) => `Math.tan(${args})`,
  math_atan2: (args) => `Math.atan2(${args})`,
  math_min: (args) => `Math.min(${args})`,
  math_max: (args) => `Math.max(${args})`,
  math_round: (args) => `Math.round(${args})`,
  math_random: () => `Math.random()`,
};

export function registerMathMacros(): void {
  registerMacros(mathMacros);

  const mathTypes: Record<string, typeof f64Type> = {};
  for (const name of Object.keys(mathMacros)) {
    mathTypes[name] = f64Type;
  }
  registerMacroTypes(mathTypes);
}
