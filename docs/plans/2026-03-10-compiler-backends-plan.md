# Complete All Compiler Backends — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete all four codegen backends (WASM, LLVM IR, EVM, NEAR WASM) with full C! feature support, then update website, docs, and README.

**Architecture:** Each backend is a standalone TypeScript file in `compiler/src/codegen/` that walks the AST and emits target-specific output. The CLI dispatches via `cbang build --target <js|wasm|llvm|evm|near>`. All backends are registered in `compiler/src/codegen/index.ts`.

**Tech Stack:** TypeScript, Vitest, WASM binary format, LLVM IR text, EVM bytecode, NEAR WASM

**Design Doc:** `docs/plans/2026-03-10-compiler-backends-design.md`

---

## Phase 1: WASM Codegen Completion

### Task 1: Add f64 floating-point support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Context:** Currently all values are treated as i64. Floats are rounded to integers. We need native f64 support.

**Step 1: Write failing tests**

Add to `compiler/tests/wasmgen.test.ts`:

```typescript
describe('floating point', () => {
  it('compiles float literals to f64', async () => {
    const wasm = generateWasm(`
      fn main() {
        let x: f64 = 3.14;
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });

  it('performs f64 arithmetic', async () => {
    const wasm = generateWasm(`
      fn add_floats(a: f64, b: f64) -> f64 {
        return a + b;
      }
      fn main() {
        let result: f64 = add_floats(1.5, 2.5);
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });

  it('handles float comparisons', async () => {
    const wasm = generateWasm(`
      fn main() {
        let x: f64 = 3.14;
        if x > 3.0 {
          println("big");
        }
      }
    `);
    const output = await runWasm(wasm);
    expect(output).toBe('big\n');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: FAIL — float operations produce wrong results or trap

**Step 3: Implement f64 support**

In `compiler/src/codegen/wasmgen.ts`:

1. Add f64 constants:
```typescript
const WASM_F64 = 0x7c;
```

2. Add f64 opcodes to the `OP` object:
```typescript
f64_const: 0x44,
f64_add: 0xa0,
f64_sub: 0xa1,
f64_mul: 0xa2,
f64_div: 0xa3,
f64_eq: 0x61,
f64_ne: 0x62,
f64_lt: 0x63,
f64_gt: 0x64,
f64_le: 0x65,
f64_ge: 0x66,
f64_neg: 0x9a,
f64_sqrt: 0x9f,
f64_floor: 0x8c,
f64_ceil: 0x8d,
f64_abs: 0x99,
i64_trunc_f64_s: 0xb0,
f64_convert_i64_s: 0xb9,
```

3. Add `encodeF64` helper:
```typescript
function encodeF64(value: number): number[] {
  const buf = new ArrayBuffer(8);
  new Float64Array(buf)[0] = value;
  return [...new Uint8Array(buf)];
}
```

4. Update `emitExpr` for FloatLiteral:
```typescript
case 'FloatLiteral':
  this.currentBody.push(OP.f64_const, ...encodeF64(parseFloat(expr.value)));
  break;
```

5. Track type context to choose between i64/f64 operations in `emitBinary`. Add a simple type inference based on operand types (if either operand is float, use f64 ops).

**Step 4: Run tests to verify they pass**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add f64 floating-point support"
```

---

### Task 2: Add match expressions to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('match expressions', () => {
  it('compiles match on integers', async () => {
    const wasm = generateWasm(`
      fn check(x: i64) {
        match x {
          1 => println("one"),
          2 => println("two"),
          _ => println("other"),
        }
      }
      fn main() {
        check(1);
        check(2);
        check(3);
      }
    `);
    const output = await runWasm(wasm);
    expect(output).toBe('one\ntwo\nother\n');
  });

  it('compiles match on booleans', async () => {
    const wasm = generateWasm(`
      fn describe(b: bool) {
        match b {
          true => println("yes"),
          false => println("no"),
        }
      }
      fn main() {
        describe(true);
        describe(false);
      }
    `);
    const output = await runWasm(wasm);
    expect(output).toBe('yes\nno\n');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: FAIL

**Step 3: Implement match in WASM**

In `wasmgen.ts`, add `MatchStmt` handling in `emitStmt`:
```typescript
case 'MatchStmt':
  this.emitMatchStmt(stmt);
  break;
```

Add `emitMatchStmt` method:
```typescript
private emitMatchStmt(stmt: import('../ast/index.js').MatchStmt): void {
  // Evaluate subject into a local
  const subjectLocal = this.addLocal('__match', WASM_I64);
  this.emitExpr(stmt.subject);
  this.currentBody.push(OP.local_set, ...encodeU32(subjectLocal));

  // Emit as chained if/else blocks
  // block { block { block { ... br_if conditions ... } arm0 } arm1 } arm2
  // Simpler approach: nested if/else
  this.emitMatchArms(stmt.arms, subjectLocal, 0);
}

private emitMatchArms(arms: import('../ast/index.js').MatchArm[], subjectLocal: number, index: number): void {
  if (index >= arms.length) return;

  const arm = arms[index]!;

  if (arm.pattern.kind === 'WildcardPattern' || arm.pattern.kind === 'IdentPattern') {
    // Default/catch-all — just emit the body
    if (arm.pattern.kind === 'IdentPattern') {
      // Bind the variable
      const bindLocal = this.addLocal(arm.pattern.name, WASM_I64);
      this.currentBody.push(OP.local_get, ...encodeU32(subjectLocal));
      this.currentBody.push(OP.local_set, ...encodeU32(bindLocal));
    }
    this.emitMatchArmBody(arm);
    return;
  }

  if (arm.pattern.kind === 'LiteralPattern') {
    // Compare subject to literal
    this.currentBody.push(OP.local_get, ...encodeU32(subjectLocal));
    if (typeof arm.pattern.value === 'boolean') {
      this.currentBody.push(OP.i64_const, ...encodeI64(arm.pattern.value ? 1 : 0));
    } else {
      this.currentBody.push(OP.i64_const, ...encodeI64(Number(arm.pattern.value)));
    }
    this.currentBody.push(OP.i64_eq);
    this.currentBody.push(OP.if, 0x40);
    this.emitMatchArmBody(arm);
    if (index < arms.length - 1) {
      this.currentBody.push(OP.else);
      this.emitMatchArms(arms, subjectLocal, index + 1);
    }
    this.currentBody.push(OP.end);
    return;
  }

  // ConstructorPattern — check tag
  if (arm.pattern.kind === 'ConstructorPattern') {
    // For now, emit as comment / nop — full enum support in Task 5
    this.emitMatchArmBody(arm);
  }
}

private emitMatchArmBody(arm: import('../ast/index.js').MatchArm): void {
  if (arm.body.kind === 'Block') {
    this.emitBlock(arm.body);
  } else {
    // Expression body — emit as expression statement
    this.emitExpr(arm.body);
    if (this.exprProducesValue(arm.body)) {
      this.currentBody.push(OP.drop);
    }
  }
}
```

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add match expression support"
```

---

### Task 3: Add string interpolation to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('string interpolation', () => {
  it('compiles simple string interpolation', async () => {
    const wasm = generateWasm(`
      fn main() {
        let name = "World";
        println("Hello, {name}!");
      }
    `);
    // For MVP, interpolation emits the template without runtime substitution
    // (just the literal parts concatenated)
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement string interpolation**

In `emitExpr`, handle `StringInterpolation`:
```typescript
case 'StringInterpolation': {
  // For WASM MVP: concatenate literal parts, emit placeholders for expressions
  // Full implementation requires a string concat runtime
  let combined = '';
  for (const part of expr.parts) {
    if (part.kind === 'Literal') {
      combined += part.value;
    } else {
      combined += '<expr>';
    }
  }
  this.emitStringLiteral(combined);
  break;
}
```

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add string interpolation support (MVP)"
```

---

### Task 4: Add struct support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('structs', () => {
  it('compiles struct creation', async () => {
    const wasm = generateWasm(`
      type Point {
        x: i64,
        y: i64,
      }
      fn main() {
        let p = Point { x: 10, y: 20 };
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });

  it('compiles struct field access', async () => {
    const wasm = generateWasm(`
      type Point {
        x: i64,
        y: i64,
      }
      fn main() {
        let p = Point { x: 10, y: 20 };
        let sum: i64 = p.x + p.y;
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement structs in WASM**

Add a struct layout tracker and linear memory allocation:

```typescript
interface StructLayout {
  name: string;
  fields: { name: string; offset: number; type: number }[];
  size: number;
}

private structLayouts = new Map<string, StructLayout>();
private heapPtr = 0; // Tracked via a global
```

In the first pass, register struct types from `TypeDecl` with `body.kind === 'Struct'`. Each field gets 8 bytes (i64). Store the struct pointer as an i64 value. Field access is `i64.load` at `pointer + field_offset`.

For `Struct` expressions: allocate from a bump allocator (global `__heap_ptr`), store each field value, return the pointer.

For `FieldAccess` expressions: load from `pointer + field_offset`.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add struct allocation and field access"
```

---

### Task 5: Add enum support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('enums', () => {
  it('compiles enum declaration and match', async () => {
    const wasm = generateWasm(`
      enum Color {
        Red,
        Green,
        Blue,
      }
      fn describe(c: Color) {
        match c {
          Red => println("red"),
          Green => println("green"),
          Blue => println("blue"),
        }
      }
      fn main() {
        describe(Red);
      }
    `);
    const output = await runWasm(wasm);
    expect(output).toBe('red\n');
  });

  it('compiles enum with tuple variants', async () => {
    const wasm = generateWasm(`
      enum Shape {
        Circle(f64),
        Rect(f64, f64),
      }
      fn main() {
        let s = Circle(5.0);
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement enums in WASM**

- Unit variants: represented as i64 tag values (0, 1, 2, ...)
- Tuple variants: allocate in linear memory — tag (i64) + payload fields (i64 each)
- Match on enums: compare tag value, extract payload fields via memory loads
- Register enum declarations in the first pass to assign tag numbers

For `EnumDecl`, register each variant with its tag. For `ConstructorPattern` in match, compare tag and bind payload fields.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add enum declaration and pattern matching"
```

---

### Task 6: Add closure support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('closures', () => {
  it('compiles simple closure', async () => {
    const wasm = generateWasm(`
      fn apply(f: fn(i64) -> i64, x: i64) -> i64 {
        return f(x);
      }
      fn main() {
        let double = |x: i64| -> i64 { return x * 2; };
        let result = apply(double, 21);
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement closures**

Closures in WASM: compile the closure body as a separate WASM function. Use `funcref` table for indirect calls. The closure value is the function index stored as i64.

For closures that capture variables: allocate an environment struct in linear memory, pass it as an implicit first parameter. The closure value becomes a pair (func_index, env_ptr) packed into memory.

For MVP, support non-capturing closures (lambdas) first, which are simpler — just indirect function calls via `call_indirect`.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add closure and indirect call support"
```

---

### Task 7: Add array and for-loop support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('arrays and for loops', () => {
  it('compiles array literal', async () => {
    const wasm = generateWasm(`
      fn main() {
        let arr = [1, 2, 3];
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });

  it('compiles for loop with range', async () => {
    const wasm = generateWasm(`
      fn main() {
        let mut sum: i64 = 0;
        for i in range(1, 4) {
          sum = sum + i;
        }
      }
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement arrays and for loops**

- Arrays: allocate in linear memory with length prefix (i64 count) followed by elements (i64 each)
- Array index: bounds check, then `i64.load` at `base + 8 + index * 8`
- For loops: desugar `for x in range(a, b)` to a while loop with a counter local. The `emitStmt` for `ForStmt` should detect `range()` call in the iterable and emit the counter pattern.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add array allocation and for-loop/range support"
```

---

### Task 8: Add actor support to WASM codegen

**Files:**
- Modify: `compiler/src/codegen/wasmgen.ts`
- Modify: `compiler/tests/wasmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('actors', () => {
  it('compiles actor declaration', async () => {
    const wasm = generateWasm(`
      actor Counter {
        state count: i64 = 0;

        on Increment() {
          count = count + 1;
        }
      }
      fn main() {}
    `);
    const module = await WebAssembly.compile(wasm);
    expect(module).toBeDefined();
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`

**Step 3: Implement actors**

For WASM MVP, actors compile to structs with method functions:
- State fields → struct allocated in linear memory
- On handlers → exported functions that take the actor struct pointer as first arg
- `spawn` → allocate and initialize actor struct
- `emit` → direct function call to the handler (synchronous for single-module MVP)

This is a simplified actor model — true multi-module actors would require a host runtime.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/wasmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/wasmgen.ts compiler/tests/wasmgen.test.ts
git commit -m "feat(wasm): add actor compilation (single-module MVP)"
```

---

## Phase 2: LLVM IR Codegen

### Task 9: Create LLVM IR generator scaffold

**Files:**
- Create: `compiler/src/codegen/llvmgen.ts`
- Modify: `compiler/src/codegen/index.ts`
- Create: `compiler/tests/llvmgen.test.ts`

**Step 1: Write failing tests**

Create `compiler/tests/llvmgen.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { LlvmGenerator } from '../src/codegen/llvmgen.js';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';

function generateLlvm(source: string): string {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const gen = new LlvmGenerator();
  return gen.generate(program);
}

describe('LlvmGenerator', () => {
  describe('module structure', () => {
    it('generates valid LLVM IR module header', () => {
      const ir = generateLlvm('fn main() {}');
      expect(ir).toContain('define');
      expect(ir).toContain('i32 @main');
    });

    it('declares printf extern', () => {
      const ir = generateLlvm(`
        fn main() {
          println("hello");
        }
      `);
      expect(ir).toContain('declare');
      expect(ir).toContain('@printf');
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: FAIL — module not found

**Step 3: Create the LLVM IR generator scaffold**

Create `compiler/src/codegen/llvmgen.ts`:

```typescript
import type {
  Program, TopLevelItem, FunctionDecl, Block, Stmt, Expr,
} from '../ast/index.js';

export class LlvmGenerator {
  private output: string = '';
  private tempCounter: number = 0;
  private indent: number = 0;
  private stringLiterals: { name: string; value: string }[] = [];

  generate(program: Program): string {
    this.output = '';
    this.tempCounter = 0;
    this.stringLiterals = [];

    // Module header
    this.writeLine('; C! compiled to LLVM IR');
    this.writeLine('target triple = "x86_64-unknown-linux-gnu"');
    this.writeLine('');

    // Declare printf
    this.writeLine('declare i32 @printf(i8*, ...)');
    this.writeLine('');

    // Generate functions
    for (const item of program.items) {
      if (item.kind === 'FunctionDecl') {
        this.emitFunction(item);
        this.writeLine('');
      }
    }

    // Emit string constants at the end
    let header = '';
    for (const s of this.stringLiterals) {
      const escaped = s.value.replace(/\n/g, '\\0A').replace(/"/g, '\\22');
      const len = s.value.length + 1; // +1 for null terminator
      header += `${s.name} = private unnamed_addr constant [${len} x i8] c"${escaped}\\00"\n`;
    }

    return header + '\n' + this.output;
  }

  private emitFunction(decl: FunctionDecl): void {
    const params = decl.params.map((p, i) => `i64 %${p.name}`).join(', ');
    const retType = decl.returnType ? 'i64' : 'i32';
    const name = decl.name === 'main' ? 'main' : decl.name;
    this.writeLine(`define ${retType} @${name}(${params}) {`);
    this.writeLine('entry:');
    this.indent++;
    this.emitBlock(decl.body);
    if (name === 'main') {
      this.writeLine('ret i32 0');
    }
    this.indent--;
    this.writeLine('}');
  }

  // ... (stub methods for block/stmt/expr emission)

  private emitBlock(block: Block): void {
    for (const stmt of block.statements) {
      this.emitStmt(stmt);
    }
  }

  private emitStmt(stmt: Stmt): void {
    // Stub — will be filled in subsequent tasks
  }

  private nextTemp(): string {
    return `%t${this.tempCounter++}`;
  }

  private addStringLiteral(value: string): string {
    const name = `@.str.${this.stringLiterals.length}`;
    this.stringLiterals.push({ name, value });
    return name;
  }

  private writeLine(text: string): void {
    const prefix = text.startsWith('define') || text.startsWith('}') || text.startsWith('declare') || text.startsWith(';') || text.startsWith('target') || text === ''
      ? ''
      : '  '.repeat(this.indent);
    this.output += `${prefix}${text}\n`;
  }
}
```

Update `compiler/src/codegen/index.ts`:
```typescript
export { JsGenerator } from './jsgen.js';
export { WasmGenerator } from './wasmgen.js';
export { LlvmGenerator } from './llvmgen.js';
```

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/llvmgen.ts compiler/src/codegen/index.ts compiler/tests/llvmgen.test.ts
git commit -m "feat(llvm): create LLVM IR generator scaffold"
```

---

### Task 10: Add variables, arithmetic, and print to LLVM IR

**Files:**
- Modify: `compiler/src/codegen/llvmgen.ts`
- Modify: `compiler/tests/llvmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('variables and arithmetic', () => {
  it('generates let binding with alloca', () => {
    const ir = generateLlvm(`
      fn main() {
        let x: i64 = 42;
      }
    `);
    expect(ir).toContain('alloca i64');
    expect(ir).toContain('store i64 42');
  });

  it('generates arithmetic operations', () => {
    const ir = generateLlvm(`
      fn add(a: i64, b: i64) -> i64 {
        return a + b;
      }
    `);
    expect(ir).toContain('add i64');
    expect(ir).toContain('ret i64');
  });

  it('generates println as printf call', () => {
    const ir = generateLlvm(`
      fn main() {
        println("Hello LLVM!");
      }
    `);
    expect(ir).toContain('@printf');
    expect(ir).toContain('Hello LLVM!');
  });

  it('generates mutable variables with store/load', () => {
    const ir = generateLlvm(`
      fn main() {
        let mut x: i64 = 0;
        x = 42;
      }
    `);
    expect(ir).toContain('alloca i64');
    expect(ir).toContain('store i64 42');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`

**Step 3: Implement variables, arithmetic, and print**

Fill in `emitStmt` and `emitExpr` methods in `llvmgen.ts`:

- `LetStmt` → `%name = alloca i64` + `store i64 <value>, i64* %name`
- `AssignStmt` → `store i64 <value>, i64* %name`
- `ReturnStmt` → `ret i64 <value>`
- `IntLiteral` → return the literal as a constant
- `Binary` → `%t = add/sub/mul/sdiv i64 <left>, <right>`
- `Ident` → `%t = load i64, i64* %name`
- `MacroCall` (println) → call `@printf` with string constant

Each `emitExpr` returns the SSA name of the result (e.g., `%t0`, `42`).

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/llvmgen.ts compiler/tests/llvmgen.test.ts
git commit -m "feat(llvm): add variables, arithmetic, and printf"
```

---

### Task 11: Add control flow to LLVM IR

**Files:**
- Modify: `compiler/src/codegen/llvmgen.ts`
- Modify: `compiler/tests/llvmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('control flow', () => {
  it('generates if/else with basic blocks', () => {
    const ir = generateLlvm(`
      fn main() {
        if true {
          println("yes");
        } else {
          println("no");
        }
      }
    `);
    expect(ir).toContain('br i1');
    expect(ir).toContain('then:');
    expect(ir).toContain('else:');
    expect(ir).toContain('endif:');
  });

  it('generates while loop', () => {
    const ir = generateLlvm(`
      fn main() {
        let mut i: i64 = 0;
        while i < 10 {
          i = i + 1;
        }
      }
    `);
    expect(ir).toContain('br label');
    expect(ir).toContain('loop:');
    expect(ir).toContain('icmp slt');
  });

  it('generates match as switch', () => {
    const ir = generateLlvm(`
      fn check(x: i64) {
        match x {
          1 => println("one"),
          2 => println("two"),
          _ => println("other"),
        }
      }
    `);
    expect(ir).toContain('switch i64');
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`

**Step 3: Implement control flow**

- If/else: Generate labeled basic blocks (`then:`, `else:`, `endif:`), use `br i1 %cond, label %then, label %else`
- While: Generate `loop:` header, `br i1 %cond, label %body, label %endloop`, `br label %loop` at end of body
- Match: Use `switch i64 %val, label %default [i64 1, label %case1 ...]`
- Comparisons: `icmp eq/ne/slt/sgt/sle/sge i64 %a, %b`

Use a label counter to generate unique block names.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/llvmgen.ts compiler/tests/llvmgen.test.ts
git commit -m "feat(llvm): add if/else, while loops, and match/switch"
```

---

### Task 12: Add structs, enums, and closures to LLVM IR

**Files:**
- Modify: `compiler/src/codegen/llvmgen.ts`
- Modify: `compiler/tests/llvmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('structs and enums', () => {
  it('generates LLVM struct type', () => {
    const ir = generateLlvm(`
      type Point {
        x: i64,
        y: i64,
      }
      fn main() {
        let p = Point { x: 10, y: 20 };
      }
    `);
    expect(ir).toContain('%Point = type');
    expect(ir).toContain('i64');
  });

  it('generates enum as tagged union', () => {
    const ir = generateLlvm(`
      enum Color { Red, Green, Blue }
      fn main() {
        let c = Red;
      }
    `);
    expect(ir).toContain('i32'); // tag type
  });
});

describe('closures', () => {
  it('generates closure as function pointer', () => {
    const ir = generateLlvm(`
      fn apply(f: fn(i64) -> i64, x: i64) -> i64 {
        return f(x);
      }
      fn main() {
        let double = |x: i64| -> i64 { return x * 2; };
      }
    `);
    expect(ir).toContain('define');
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`

**Step 3: Implement structs, enums, closures**

- Structs: `%Point = type { i64, i64 }`, `alloca %Point`, `getelementptr` for field access
- Enums: Unit variants as i32 constants. Tuple variants as `{ i32, ... }` structs
- Closures: Emit as separate `define` functions. Non-capturing closures are function pointers. Store as `i64` (bitcast from function pointer).

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/llvmgen.ts compiler/tests/llvmgen.test.ts
git commit -m "feat(llvm): add structs, enums, and closures"
```

---

### Task 13: Add actors and remaining features to LLVM IR

**Files:**
- Modify: `compiler/src/codegen/llvmgen.ts`
- Modify: `compiler/tests/llvmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('actors', () => {
  it('generates actor as struct with methods', () => {
    const ir = generateLlvm(`
      actor Counter {
        state count: i64 = 0;
        on Increment() {
          count = count + 1;
        }
      }
      fn main() {}
    `);
    expect(ir).toContain('%Counter = type');
    expect(ir).toContain('define');
  });
});

describe('strings and floats', () => {
  it('generates f64 operations', () => {
    const ir = generateLlvm(`
      fn main() {
        let x: f64 = 3.14;
        let y: f64 = x * 2.0;
      }
    `);
    expect(ir).toContain('double');
    expect(ir).toContain('fmul');
  });

  it('generates for loop', () => {
    const ir = generateLlvm(`
      fn main() {
        for i in range(0, 10) {
          println("iter");
        }
      }
    `);
    expect(ir).toContain('icmp');
    expect(ir).toContain('br');
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`

**Step 3: Implement actors, floats, for loops**

- Actors: Emit as struct type + method functions (same pattern as WASM task 8)
- Floats: `double` type, `fadd`/`fsub`/`fmul`/`fdiv`, `fcmp olt/ogt/...`
- For loops: Desugar `for x in range(a, b)` to a while loop with counter
- String interpolation: Concatenate literal parts with `@printf` format strings
- Arrays: `alloca [N x i64]`, `getelementptr` for indexing

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/llvmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/llvmgen.ts compiler/tests/llvmgen.test.ts
git commit -m "feat(llvm): add actors, f64, for loops, and arrays"
```

---

## Phase 3: EVM Codegen

### Task 14: Create EVM codegen scaffold

**Files:**
- Create: `compiler/src/codegen/evmgen.ts`
- Modify: `compiler/src/codegen/index.ts`
- Create: `compiler/tests/evmgen.test.ts`

**Step 1: Write failing tests**

Create `compiler/tests/evmgen.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { EvmGenerator } from '../src/codegen/evmgen.js';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';

function generateEvm(source: string): { bytecode: string; abi: any[] } {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const gen = new EvmGenerator();
  return gen.generate(program);
}

describe('EvmGenerator', () => {
  describe('basic contract', () => {
    it('generates bytecode for empty contract', () => {
      const result = generateEvm(`
        contract Token {
          state supply: u256 = 0;
        }
      `);
      expect(result.bytecode).toBeTruthy();
      expect(result.bytecode.startsWith('60')).toBe(true); // PUSH opcode
    });

    it('generates ABI for contract functions', () => {
      const result = generateEvm(`
        contract Token {
          state supply: u256 = 0;

          pub fn totalSupply() -> u256 {
            return supply;
          }
        }
      `);
      expect(result.abi).toBeInstanceOf(Array);
      expect(result.abi.some(e => e.name === 'totalSupply')).toBe(true);
    });

    it('errors on non-contract code', () => {
      expect(() => generateEvm(`
        fn main() {
          println("hello");
        }
      `)).toThrow(/contract/i);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`

**Step 3: Create the EVM generator**

Create `compiler/src/codegen/evmgen.ts`:

```typescript
import type { Program, ContractDecl, FunctionDecl, StateDecl, Stmt, Expr } from '../ast/index.js';

// EVM opcodes
const EVM = {
  STOP: '00', PUSH1: '60', PUSH2: '61', PUSH4: '63', PUSH32: '7f',
  POP: '50', DUP1: '80', SWAP1: '90',
  ADD: '01', SUB: '03', MUL: '02', DIV: '04', MOD: '06',
  LT: '10', GT: '11', EQ: '14', ISZERO: '15',
  SLOAD: '54', SSTORE: '55',
  CALLDATALOAD: '35', CALLDATASIZE: '36',
  JUMP: '56', JUMPI: '57', JUMPDEST: '5b',
  MLOAD: '51', MSTORE: '52',
  RETURN: 'f3', REVERT: 'fd',
  LOG0: 'a0', LOG1: 'a1',
  CODECOPY: '39',
} as const;

interface AbiEntry {
  type: 'function' | 'event';
  name: string;
  inputs: { name: string; type: string }[];
  outputs: { name: string; type: string }[];
  stateMutability?: string;
}

export class EvmGenerator {
  private bytecode: string[] = [];
  private abi: AbiEntry[] = [];
  private storageSlots = new Map<string, number>();
  private nextSlot = 0;

  generate(program: Program): { bytecode: string; abi: AbiEntry[] } {
    this.bytecode = [];
    this.abi = [];
    this.storageSlots.clear();
    this.nextSlot = 0;

    // Find contract declarations
    const contracts = program.items.filter(i => i.kind === 'ContractDecl') as ContractDecl[];
    if (contracts.length === 0) {
      throw new Error('EVM target requires contract blocks. Use --target js or --target wasm for non-contract code.');
    }

    for (const contract of contracts) {
      this.emitContract(contract);
    }

    return {
      bytecode: this.bytecode.join(''),
      abi: this.abi,
    };
  }

  private emitContract(decl: ContractDecl): void {
    // Register state variables as storage slots
    const stateMembers = decl.members.filter(m => m.kind === 'StateDecl') as StateDecl[];
    for (const s of stateMembers) {
      this.storageSlots.set(s.name, this.nextSlot++);
    }

    // Register public functions in ABI
    const functions = decl.members.filter(m => m.kind === 'FunctionDecl') as FunctionDecl[];
    for (const fn of functions) {
      if (fn.visibility === 'public') {
        this.abi.push({
          type: 'function',
          name: fn.name,
          inputs: fn.params.map(p => ({ name: p.name, type: 'uint256' })),
          outputs: fn.returnType ? [{ name: '', type: 'uint256' }] : [],
          stateMutability: 'view',
        });
      }
    }

    // Emit dispatcher bytecode
    this.emitDispatcher(functions);
  }

  private emitDispatcher(functions: FunctionDecl[]): void {
    // Push CALLDATALOAD to get function selector
    this.push(EVM.CALLDATASIZE);
    // ... simplified dispatcher that routes to functions based on selector
    // For MVP, emit a basic STOP
    this.push(EVM.STOP);
  }

  private push(...opcodes: string[]): void {
    this.bytecode.push(...opcodes);
  }
}
```

Update `compiler/src/codegen/index.ts` to add:
```typescript
export { EvmGenerator } from './evmgen.js';
```

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/evmgen.ts compiler/src/codegen/index.ts compiler/tests/evmgen.test.ts
git commit -m "feat(evm): create EVM bytecode generator scaffold"
```

---

### Task 15: Implement EVM function dispatch and storage

**Files:**
- Modify: `compiler/src/codegen/evmgen.ts`
- Modify: `compiler/tests/evmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('function dispatch', () => {
  it('generates function selector matching', () => {
    const result = generateEvm(`
      contract Token {
        state supply: u256 = 1000;

        pub fn totalSupply() -> u256 {
          return supply;
        }

        pub fn transfer(to: address, amount: u256) {
          supply = supply - amount;
        }
      }
    `);
    // Should contain CALLDATALOAD for selector
    expect(result.bytecode).toContain(EVM.CALLDATALOAD);
    expect(result.abi.length).toBe(2);
  });

  it('generates SLOAD for state reads', () => {
    const result = generateEvm(`
      contract Token {
        state supply: u256 = 0;
        pub fn getSupply() -> u256 {
          return supply;
        }
      }
    `);
    expect(result.bytecode).toContain(EVM.SLOAD);
  });

  it('generates SSTORE for state writes', () => {
    const result = generateEvm(`
      contract Token {
        state supply: u256 = 0;
        pub fn setSupply(val: u256) {
          supply = val;
        }
      }
    `);
    expect(result.bytecode).toContain(EVM.SSTORE);
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`

**Step 3: Implement dispatch and storage**

Implement the full function selector dispatch pattern:
1. Load first 4 bytes of calldata (function selector)
2. Compare against keccak256 hashes of function signatures
3. Jump to the matching function body
4. Implement SLOAD/SSTORE for state variable access
5. Implement RETURN for returning values

For keccak256, use a simplified hash or a lookup table for known selectors.

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/evmgen.ts compiler/tests/evmgen.test.ts
git commit -m "feat(evm): add function dispatch and storage operations"
```

---

### Task 16: Add control flow, events, and arithmetic to EVM

**Files:**
- Modify: `compiler/src/codegen/evmgen.ts`
- Modify: `compiler/tests/evmgen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('EVM control flow', () => {
  it('generates JUMPI for if statements', () => {
    const result = generateEvm(`
      contract Guard {
        state locked: bool = false;
        pub fn check() -> u256 {
          if locked {
            return 0;
          }
          return 1;
        }
      }
    `);
    expect(result.bytecode).toContain(EVM.JUMPI);
    expect(result.bytecode).toContain(EVM.JUMPDEST);
  });

  it('generates events with LOG', () => {
    const result = generateEvm(`
      contract Token {
        state supply: u256 = 0;
        pub fn mint(amount: u256) {
          supply = supply + amount;
          emit Transfer(amount);
        }
      }
    `);
    expect(result.bytecode).toContain(EVM.LOG1);
    expect(result.abi.some(e => e.type === 'event')).toBe(true);
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`

**Step 3: Implement control flow and events**

- If/else: `JUMPI` + `JUMPDEST` pairs with condition on stack
- While: `JUMPDEST` at top, `JUMPI` to skip, `JUMP` back
- Match: Chained `DUP1` + `PUSH` + `EQ` + `JUMPI`
- Events: Hash event signature for topic, `LOG1` with data
- Arithmetic: Direct mapping to `ADD`/`SUB`/`MUL`/`DIV`/`MOD`
- Comparisons: `LT`/`GT`/`EQ` opcodes

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/evmgen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/evmgen.ts compiler/tests/evmgen.test.ts
git commit -m "feat(evm): add control flow, events, and arithmetic"
```

---

## Phase 4: NEAR WASM Codegen

### Task 17: Create NEAR WASM generator

**Files:**
- Create: `compiler/src/codegen/neargen.ts`
- Modify: `compiler/src/codegen/index.ts`
- Create: `compiler/tests/neargen.test.ts`

**Step 1: Write failing tests**

Create `compiler/tests/neargen.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { NearGenerator } from '../src/codegen/neargen.js';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';

function generateNear(source: string): Uint8Array {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const gen = new NearGenerator();
  return gen.generate(program);
}

describe('NearGenerator', () => {
  describe('NEAR contract basics', () => {
    it('produces valid WASM binary', async () => {
      const wasm = generateNear(`
        contract Token {
          state supply: u128 = 0;
          pub fn get_supply() -> u128 {
            return supply;
          }
        }
      `);
      expect(wasm[0]).toBe(0x00); // WASM magic
      expect(wasm[1]).toBe(0x61);
      expect(wasm[2]).toBe(0x73);
      expect(wasm[3]).toBe(0x6d);
    });

    it('imports NEAR env functions', async () => {
      const wasm = generateNear(`
        contract Token {
          state supply: u128 = 0;
          pub fn get_supply() -> u128 {
            return supply;
          }
        }
      `);
      const module = await WebAssembly.compile(wasm);
      const imports = WebAssembly.Module.imports(module);
      expect(imports.some(i => i.module === 'env')).toBe(true);
    });

    it('exports contract methods', async () => {
      const wasm = generateNear(`
        contract Token {
          state supply: u128 = 0;
          pub fn get_supply() -> u128 {
            return supply;
          }
        }
      `);
      const module = await WebAssembly.compile(wasm);
      const exports = WebAssembly.Module.exports(module);
      expect(exports.some(e => e.name === 'get_supply')).toBe(true);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd compiler && npx vitest run tests/neargen.test.ts --reporter=verbose`

**Step 3: Create the NEAR generator**

Create `compiler/src/codegen/neargen.ts` that extends the WASM generator approach but with NEAR-specific imports:

```typescript
import type { Program, ContractDecl, FunctionDecl, StateDecl } from '../ast/index.js';

/**
 * NEAR WASM code generator for C! smart contracts.
 *
 * Generates WASM modules that use NEAR's env host imports
 * for storage, logging, and cross-contract calls.
 */
export class NearGenerator {
  // ... (similar structure to WasmGenerator but with NEAR env imports)
  // Import env::storage_read, env::storage_write, env::input,
  // env::value_return, env::log_utf8, etc.

  generate(program: Program): Uint8Array {
    // Find contract declarations
    const contracts = program.items.filter(i => i.kind === 'ContractDecl') as ContractDecl[];

    // Also handle regular functions as internal helpers
    // Export public contract functions
    // Use NEAR storage API for state variables

    // Build WASM module with NEAR env imports instead of WASI
    return this.buildModule();
  }

  private buildModule(): Uint8Array {
    // Similar to WasmGenerator.buildModule() but:
    // - Imports from 'env' namespace instead of 'wasi_snapshot_preview1'
    // - Exports contract methods directly (not as _start)
    // - No memory export needed (NEAR manages memory)
    // ...
  }
}
```

Update `compiler/src/codegen/index.ts`:
```typescript
export { NearGenerator } from './neargen.js';
```

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/neargen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/neargen.ts compiler/src/codegen/index.ts compiler/tests/neargen.test.ts
git commit -m "feat(near): create NEAR WASM generator with env imports"
```

---

### Task 18: Add NEAR storage, events, and cross-contract calls

**Files:**
- Modify: `compiler/src/codegen/neargen.ts`
- Modify: `compiler/tests/neargen.test.ts`

**Step 1: Write failing tests**

```typescript
describe('NEAR storage', () => {
  it('generates storage_write for state mutations', async () => {
    const wasm = generateNear(`
      contract Counter {
        state count: u128 = 0;
        pub fn increment() {
          count = count + 1;
        }
      }
    `);
    const module = await WebAssembly.compile(wasm);
    const imports = WebAssembly.Module.imports(module);
    expect(imports.some(i => i.name === 'storage_write')).toBe(true);
  });

  it('generates log_utf8 for emit statements', async () => {
    const wasm = generateNear(`
      contract Token {
        state supply: u128 = 0;
        pub fn mint(amount: u128) {
          supply = supply + amount;
          emit Transfer(amount);
        }
      }
    `);
    const module = await WebAssembly.compile(wasm);
    const imports = WebAssembly.Module.imports(module);
    expect(imports.some(i => i.name === 'log_utf8')).toBe(true);
  });
});
```

**Step 2: Run tests**

Run: `cd compiler && npx vitest run tests/neargen.test.ts --reporter=verbose`

**Step 3: Implement NEAR storage and events**

- State reads: call `env.storage_read(key_ptr, key_len)`, read result from register
- State writes: call `env.storage_write(key_ptr, key_len, value_ptr, value_len)`
- Events: serialize event as JSON string, call `env.log_utf8(len, ptr)`
- Cross-contract calls: `env.promise_create(account, method, args, gas, deposit)`
- Input parsing: `env.input(register_id)`, `env.read_register(register_id, ptr)`
- Return values: `env.value_return(len, ptr)`

**Step 4: Run tests**

Run: `cd compiler && npx vitest run tests/neargen.test.ts --reporter=verbose`
Expected: PASS

**Step 5: Commit**

```bash
git add compiler/src/codegen/neargen.ts compiler/tests/neargen.test.ts
git commit -m "feat(near): add storage, events, and cross-contract calls"
```

---

## Phase 5: CLI Integration

### Task 19: Update CLI to support all targets

**Files:**
- Modify: `compiler/src/cli.ts`

**Step 1: Write a manual test plan**

Test commands to verify:
- `cbang build --target js test.cb` → produces `.js`
- `cbang build --target wasm test.cb` → produces `.wasm`
- `cbang build --target llvm test.cb` → produces `.ll`
- `cbang build --target evm test.cb` → produces `.hex` + `.abi.json`
- `cbang build --target near test.cb` → produces `.wasm`
- `cbang build test.cb` → defaults to JS
- Invalid target → clear error message

**Step 2: Update the build command in `cli.ts`**

In `compiler/src/cli.ts`, update the `buildCommand` function:

```typescript
async function buildCommand(filePath: string, target: string = 'js'): Promise<void> {
  const source = readSource(filePath);
  const program = parseAndCheck(source, filePath);

  switch (target) {
    case 'js': {
      const { JsGenerator } = await import('./codegen/index.js');
      const js = new JsGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.js';
      writeFileSync(outFile, js, 'utf-8');
      console.log(`✓ Compiled to ${outFile}`);
      break;
    }
    case 'wasm': {
      const { WasmGenerator } = await import('./codegen/index.js');
      const wasm = new WasmGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.wasm';
      writeFileSync(outFile, wasm);
      console.log(`✓ Compiled to ${outFile} (${wasm.length} bytes)`);
      break;
    }
    case 'llvm': {
      const { LlvmGenerator } = await import('./codegen/index.js');
      const ir = new LlvmGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.ll';
      writeFileSync(outFile, ir, 'utf-8');
      console.log(`✓ Compiled to ${outFile}`);
      console.log('  Run with: lli ' + outFile);
      console.log('  Or compile: llc ' + outFile + ' -o output.o && clang output.o -o output');
      break;
    }
    case 'evm': {
      const { EvmGenerator } = await import('./codegen/index.js');
      const result = new EvmGenerator().generate(program);
      const outFile = basename(filePath, '.cb');
      writeFileSync(outFile + '.hex', result.bytecode, 'utf-8');
      writeFileSync(outFile + '.abi.json', JSON.stringify(result.abi, null, 2), 'utf-8');
      console.log(`✓ Compiled to ${outFile}.hex + ${outFile}.abi.json`);
      break;
    }
    case 'near': {
      const { NearGenerator } = await import('./codegen/index.js');
      const wasm = new NearGenerator().generate(program);
      const outFile = basename(filePath, '.cb') + '.near.wasm';
      writeFileSync(outFile, wasm);
      console.log(`✓ Compiled to ${outFile} (${wasm.length} bytes)`);
      break;
    }
    default:
      console.error(`Error: unknown target '${target}'`);
      console.error('Valid targets: js, wasm, llvm, evm, near');
      process.exit(1);
  }
}
```

Also update `printHelp()` to list all targets.

**Step 3: Test manually**

Run: `cd compiler && npm run build` to verify it compiles.

**Step 4: Commit**

```bash
git add compiler/src/cli.ts
git commit -m "feat(cli): add build targets for llvm, evm, and near"
```

---

## Phase 6: Website, Docs, and README Updates

### Task 20: Update website with new compiler targets

**Files:**
- Modify: `website/index.html`
- Modify: `website/style.css`
- Modify: `website/docs.html`
- Modify: `website/getting-started.html`

**Step 1: Update homepage**

In `website/index.html`:
- Update the Compiler Pipeline Status section to show all backends as complete (or in-progress)
- Update the hero stats to reflect new test count (~800+)
- Add a "Multi-Target Compilation" section showcasing all 5 targets with icons/descriptions
- Update the "Build" section to show `cbang build --target <js|wasm|llvm|evm|near>`

**Step 2: Update docs page**

In `website/docs.html`:
- Add documentation section for each target (what it outputs, how to use it)
- Add CLI reference for the `--target` flag

**Step 3: Update getting-started page**

In `website/getting-started.html`:
- Add a "Compile to Different Targets" section with examples
- Show sample commands for each target

**Step 4: Update CSS if needed**

Add any new styles for target showcase cards or icons.

**Step 5: Commit**

```bash
git add website/
git commit -m "docs(website): update for multi-target compilation"
```

---

### Task 21: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update README sections**

- Update compiler status section with all 5 backends and their status
- Update the "Quick Start" section to show multi-target build commands
- Update test count
- Add a "Compilation Targets" section explaining what each target does
- Update the architecture/structure section to reflect new codegen files
- Make sure the project sounds exciting and contributor-friendly

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with multi-target compiler status"
```

---

### Task 22: Rebuild browser playground bundle

**Files:**
- Modify: `website/playground/cbang-compiler.js` (rebuilt)

**Step 1: Rebuild the esbuild bundle**

The playground uses a browser-bundled version of the compiler. After all codegen changes, rebuild it:

```bash
cd compiler && npx esbuild src/codegen/index.ts src/codegen/jsgen.ts src/codegen/wasmgen.ts src/lexer/index.ts src/parser/index.ts --bundle --format=iife --global-name=CBang --outfile=../website/playground/cbang-compiler.js --platform=browser
```

Or use whatever build script exists in the project.

**Step 2: Test the playground locally**

Open `website/playground/index.html` in a browser, verify all examples still work.

**Step 3: Commit**

```bash
git add website/playground/cbang-compiler.js
git commit -m "build: rebuild playground bundle with updated codegen"
```

---

### Task 23: Update memory and run final tests

**Step 1: Run the full test suite**

```bash
cd compiler && npx vitest run --reporter=verbose
```

Expected: All tests pass (~800+)

**Step 2: Update project memory**

Update `MEMORY.md` with:
- New test count
- New codegen backends and their status
- Updated compiler status section

**Step 3: Final commit**

```bash
git add -A && git commit -m "chore: update project memory after compiler backends"
```
