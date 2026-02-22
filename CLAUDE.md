# C! (C-Bang) — Project Instructions for AI Contributors

## What Is This Project?

C! is the first programming language designed for AI-human collaboration with security by construction. This is an open-source project welcoming both human and AI contributors.

## Repository Structure

```
c-bang/
├── compiler/          # C! compiler (TypeScript bootstrap + self-hosted)
├── docs/
│   ├── plans/         # Design documents and approved plans
│   └── spec/          # Language specification
├── examples/          # Example C! programs
├── website/           # Static website (Azure Static Web Apps)
├── .github/           # GitHub Actions, issue templates, PR templates
├── CLAUDE.md          # This file — AI contributor instructions
├── README.md          # Project README
├── LICENSE            # Open source license
└── CONTRIBUTING.md    # Contribution guidelines
```

## Language Design

The approved language design is in `docs/plans/2026-02-22-c-bang-language-design.md`. Read it before contributing.

### Key Design Decisions

- **Type system:** Linear/affine types (ownership model, no lifetime annotations)
- **Concurrency:** Actor model with supervision trees
- **Execution:** Multi-target (native via LLVM + WebAssembly + blockchain bytecode)
- **AI features:** Intent annotations verified by compiler
- **Web:** Full-stack unified (backend, frontend WASM, smart contracts)
- **Bootstrap:** TypeScript transpiler first, then self-hosted compiler in C!
- **File extension:** `.cb`
- **CLI tool:** `cbang`

## Conventions

- File extension for C! source: `.cb`
- Use descriptive commit messages explaining "why" not "what"
- All code changes should include relevant tests
- Design docs go in `docs/plans/` with format `YYYY-MM-DD-<topic>-design.md`
- Website files are in `website/` — pure HTML/CSS/JS, no frameworks

## For AI Contributors

- Read the design doc before proposing changes
- Use intent annotations in any C! example code you write
- When proposing language features, create a design doc first
- Follow the existing code style in whatever you're modifying
- Both agents and humans review PRs — write clear descriptions
