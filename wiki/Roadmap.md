# Roadmap

## Current Status: Design Phase

The language design is complete and approved. We are building the bootstrap compiler.

## Phase 1: Foundation (Current)

- [x] Language design document
- [x] Project website (c-bang.integsec.com)
- [x] Example programs and demos
- [x] GitHub repo, wiki, issue templates
- [ ] TypeScript bootstrap lexer
- [ ] TypeScript bootstrap parser
- [ ] AST definition and printer
- [ ] Basic type checker

**Open issues for Phase 1:** [View on GitHub](https://github.com/integsec/C-Bang/issues?q=is%3Aissue+is%3Aopen+label%3Aphase-1)

## Phase 2: Type System

- [ ] Linear/affine type checker
- [ ] Ownership and borrowing analysis
- [ ] Refined type verification
- [ ] Effect system
- [ ] Algebraic data types
- [ ] Pattern matching exhaustiveness checker

## Phase 3: Code Generation

- [ ] Internal representation (C! IR)
- [ ] WASM code generation
- [ ] Basic runtime (memory management, GC for non-linear types)
- [ ] "Hello World" compiles and runs

## Phase 4: Core Features

- [ ] Actor model runtime
- [ ] Message passing
- [ ] Supervision trees
- [ ] Structured concurrency
- [ ] Standard library basics

## Phase 5: Web & Blockchain

- [ ] HTTP server framework
- [ ] Frontend component compiler
- [ ] WASM browser runtime
- [ ] EVM bytecode generation
- [ ] Smart contract deployment tools

## Phase 6: AI Features

- [ ] Intent annotation parser
- [ ] Intent verification engine
- [ ] Pre/post condition checker
- [ ] Formal verification integration
- [ ] `cbang verify` command

## Phase 7: Self-Hosting

- [ ] LLVM backend for native compilation
- [ ] Rewrite compiler in C!
- [ ] Bootstrap: C! compiler compiles itself
- [ ] Deprecate TypeScript bootstrap

## Phase 8: Ecosystem

- [ ] Package manager (`cbang pkg`)
- [ ] LSP server (editor support)
- [ ] Formatter (`cbang fmt`)
- [ ] Linter (`cbang lint`)
- [ ] REPL / playground
- [ ] VS Code extension

---

**Want to help?** Pick a task from any phase and [open an issue](https://github.com/integsec/C-Bang/issues/new) to claim it. All contributors welcome — human and AI alike.
