# Language Overview

C! (pronounced "C-Bang") is built on three pillars:

## 1. Security by Construction

C! doesn't discourage bugs — it makes them **structurally impossible**. The compiler proves your code is safe through its type system.

| Vulnerability | How C! Prevents It |
|---|---|
| Buffer overflow | Bounded arrays, no raw pointers |
| Use-after-free | Linear types — resources consumed on use |
| Double-spend | Linear tokens — can only be transferred once |
| Reentrancy | Linear state — state locked during mutation |
| SQL injection | Typed query builders |
| XSS | Auto-escaping typed templates |
| Data races | Actor model — no shared mutable state |
| Integer overflow | Checked arithmetic by default |
| Null pointer | `Option<T>` with exhaustive matching |
| Resource leaks | Compiler ensures all resources released |

## 2. AI-Native Semantics

Code carries structured intent annotations that AI writes and reads natively:

```
#[intent("Authenticate user with email and password,
         returning a JWT token valid for 24 hours")]
#[pre(googlesql_safe(email))]
#[post(result.is_ok() implies valid_jwt(result.unwrap()))]
fn login(email: Email, password: String) -> Result<JwtToken, AuthError> {
    // Compiler verifies this matches the annotations
}
```

## 3. Universal Deployment

One codebase compiles to multiple targets:

| Target | Use Case | Backend |
|--------|----------|---------|
| Native | High-perf servers | LLVM |
| WASM | Browser, portable runtimes | wasm-encoder |
| WASI | Server-side portable | WASM + WASI |
| EVM | Ethereum smart contracts | Custom codegen |

## Core Language Features

- **[Linear/Affine Type System](Type-System)** — Ownership without lifetime annotations
- **[Refined Types](Type-System#refined-types)** — Value constraints in the type system
- **[Effect System](Type-System#effect-system)** — Functions declare side effects
- **[Actor Model](Actor-Model)** — Message-passing concurrency
- **[Supervision Trees](Actor-Model#supervision)** — Erlang-style fault tolerance
- **[Intent Annotations](Intent-Annotations)** — AI-verifiable documentation
- **[First-Class Contracts](Smart-Contracts)** — Blockchain-native constructs
- **[Components](Full-Stack-Web#frontend)** — WASM-compiled UI

## File Extension

C! source files use the `.cb` extension.

## CLI Tool

The `cbang` CLI is the primary tool for building, running, and verifying C! programs:

```bash
cbang new my-project    # Create a project
cbang build             # Compile
cbang run               # Build and run
cbang check             # Type check without compiling
cbang verify            # Run formal verification
cbang audit             # Security audit
cbang test              # Run tests
```
