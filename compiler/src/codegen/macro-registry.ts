export type MacroHandler = (args: string, rawArgs: string[]) => string;

const macroHandlers = new Map<string, MacroHandler>();

export function registerMacro(name: string, handler: MacroHandler): void {
  macroHandlers.set(name, handler);
}

export function registerMacros(macros: Record<string, MacroHandler>): void {
  for (const [name, handler] of Object.entries(macros)) {
    macroHandlers.set(name, handler);
  }
}

export function getMacroHandler(name: string): MacroHandler | undefined {
  return macroHandlers.get(name);
}

export function hasMacro(name: string): boolean {
  return macroHandlers.has(name);
}
