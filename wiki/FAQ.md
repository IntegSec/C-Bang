# Frequently Asked Questions

## General

### What is C!?

C! (pronounced "C-Bang") is an open-source programming language designed for AI-human collaboration with security by construction. It compiles to native binaries, WebAssembly, and blockchain bytecode.

### Why a new language?

Every existing language was designed for humans. C! is the first language designed equally for AI agents and humans. Its type system makes entire vulnerability classes impossible, and its intent annotations let AI prove code correctness.

### Is C! ready to use?

C! is in the **design phase**. The language specification is complete and the bootstrap compiler (TypeScript) is under development. You can explore the [design document](https://github.com/integsec/C-Bang/blob/main/docs/plans/2026-02-22-c-bang-language-design.md) and [example programs](https://github.com/integsec/C-Bang/tree/main/examples).

### How is C! different from Rust?

C! inherits Rust's ownership model but diverges in several key ways:
- **No lifetime annotations** — inferred automatically
- **Actor model** built into the language (not a library)
- **Intent annotations** — compiler verifies code matches intent
- **First-class smart contracts** — not just a compilation target
- **Full-stack** — frontend components compile to WASM natively
- **Designed for AI** — structured metadata for AI navigation

### How is C! different from Solidity?

C! eliminates entire classes of smart contract vulnerabilities by construction:
- Reentrancy is **impossible** (linear state)
- Integer overflow is **impossible** (checked arithmetic)
- C! compiles to EVM but also to native and WASM
- Same language for your backend, frontend, AND contracts

## Technical

### What does "security by construction" mean?

It means vulnerabilities are prevented by the type system, not by coding discipline. For example, a double-spend is impossible because tokens are linear types — once transferred, they can't be used again. This is a compile error, not a runtime check.

### What are intent annotations?

Structured comments that describe what code should do. The compiler verifies the implementation matches. They serve as:
- Machine-readable documentation
- Compiler verification targets
- AI-to-AI communication channel
- Human-readable summaries

### Can I use C! without the AI features?

Yes. Intent annotations are optional (though recommended). The type system, actor model, and compilation targets work regardless. You'll still get security guarantees from linear types.

### What blockchain does C! support?

Initially targeting Ethereum (EVM). Future targets include Solana and Cosmos (CosmWasm). The language is chain-agnostic — same source code, different compilation targets.

## Contributing

### Can AI agents contribute?

**Yes!** AI agents are first-class contributors. Read [CLAUDE.md](https://github.com/integsec/C-Bang/blob/main/CLAUDE.md) for project conventions. Open issues, submit PRs, review code — everything humans can do.

### How do I report a bug?

[Open a bug report](https://github.com/integsec/C-Bang/issues/new?template=bug_report.md) on GitHub Issues.

### How do I suggest a feature?

[Open a feature request](https://github.com/integsec/C-Bang/issues/new?template=feature_request.md) on GitHub Issues. For significant language changes, create a design document in `docs/plans/` first.

### Where do I ask questions?

- [GitHub Discussions](https://github.com/integsec/C-Bang/discussions) for general questions
- [GitHub Issues](https://github.com/integsec/C-Bang/issues) for bugs and feature requests
- The [Wiki](https://github.com/integsec/C-Bang/wiki) for documentation
