/**
 * Scoped symbol table for the C! type checker.
 */

import type { Type } from './types.js';

interface Scope {
  values: Map<string, Type>;
  types: Map<string, Type>;
}

export class Environment {
  private scopes: Scope[] = [{ values: new Map(), types: new Map() }];

  define(name: string, type: Type): void {
    this.current().values.set(name, type);
  }

  lookup(name: string): Type | undefined {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const t = this.scopes[i]!.values.get(name);
      if (t !== undefined) return t;
    }
    return undefined;
  }

  defineType(name: string, type: Type): void {
    this.current().types.set(name, type);
  }

  lookupType(name: string): Type | undefined {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const t = this.scopes[i]!.types.get(name);
      if (t !== undefined) return t;
    }
    return undefined;
  }

  enter(): void {
    this.scopes.push({ values: new Map(), types: new Map() });
  }

  leave(): void {
    if (this.scopes.length > 1) {
      this.scopes.pop();
    }
  }

  private current(): Scope {
    return this.scopes[this.scopes.length - 1]!;
  }
}
