# Compiler Architecture

## Overview

C! uses an AI-accelerated bootstrap strategy:

1. **TypeScript transpiler** — for rapid prototyping and playground
2. **Self-hosted compiler** — written in C!, targeting LLVM/WASM

The TypeScript transpiler is the current focus. Once the language stabilizes, the self-hosted compiler takes over.

## Compiler Pipeline

```
Source (.cb file)
    │
    ▼
┌─────────┐
│  Lexer  │  → Tokens
└────┬────┘
     │
     ▼
┌─────────┐
│ Parser  │  → AST (Abstract Syntax Tree)
└────┬────┘
     │
     ▼
┌──────────────┐
│ Type Checker │  → Typed AST
│ + Ownership  │    (linear types verified)
│ + Effects    │    (effects checked)
│ + Refinement │    (value constraints proven)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Intent    │  → Verified AST
│ Verification │    (intent matches implementation)
└──────┬───────┘
       │
       ▼
┌─────────────┐
│  IR (C! IR) │  → Internal Representation
└──────┬──────┘
       │
       ├──────────────┐──────────────┐
       ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│   LLVM    │  │   WASM    │  │    EVM    │
│  Backend  │  │  Backend  │  │  Backend  │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      ▼              ▼              ▼
   Native         .wasm         Bytecode
   Binary         Module        (deploy)
```

## Project Structure

```
c-bang/
├── compiler/           # TypeScript bootstrap compiler
│   ├── src/
│   │   ├── lexer/      # Tokenizer
│   │   ├── parser/     # Parser → AST
│   │   ├── ast/        # AST node definitions
│   │   ├── checker/    # Type checker + ownership
│   │   ├── ir/         # Internal representation
│   │   ├── codegen/    # Code generation backends
│   │   │   ├── wasm/
│   │   │   ├── llvm/
│   │   │   └── evm/
│   │   ├── verify/     # Intent verification
│   │   └── cli/        # cbang CLI
│   ├── tests/
│   └── package.json
├── docs/
│   ├── plans/          # Design documents
│   ├── spec/           # Language specification
│   └── promotion/      # Marketing content
├── examples/
│   ├── demos/          # Downloadable demo apps
│   └── *.cb            # Standalone examples
├── website/            # Static site (Azure SWA)
├── wiki/               # GitHub wiki source
└── .github/            # CI/CD, templates
```

## Key Design Decisions

1. **TypeScript for bootstrap** — fastest iteration for AI-driven development
2. **No parser generator** — hand-written recursive descent for better errors
3. **Multi-backend IR** — single IR lowered to LLVM, WASM, or EVM
4. **Incremental compilation** — essential for large projects
5. **LSP-first** — editor support as a primary output, not afterthought
