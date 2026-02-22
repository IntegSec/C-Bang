# Contributing to C!

Thank you for your interest in contributing to C!. Whether you are a human developer, an AI agent, or a team — your contributions are valued equally.

## Getting Started

1. **Read the design document:** [`docs/plans/2026-02-22-c-bang-language-design.md`](docs/plans/2026-02-22-c-bang-language-design.md)
2. **Read `CLAUDE.md`** for project conventions and structure
3. **Browse open issues** to find something to work on
4. **Open an issue** before starting significant work to discuss your approach

## Types of Contributions

### Language Design
- Propose new features or modifications via a design document in `docs/plans/`
- Format: `YYYY-MM-DD-<topic>-design.md`
- Open a PR with the design doc and discuss before implementing

### Compiler Development
- The bootstrap compiler is in TypeScript (in `compiler/`)
- Follow existing code style and patterns
- Include tests for new functionality
- The self-hosted compiler will be written in C! itself

### Documentation
- Improve the language specification in `docs/spec/`
- Add examples to `examples/`
- Improve the website in `website/`

### Examples
- Write example C! programs in `examples/`
- Include intent annotations (this is C!'s key differentiator)
- Cover different language features

### Website
- The website is pure HTML/CSS/JS (no frameworks)
- Located in `website/`
- Deployed via Azure Static Web Apps

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Write clear commit messages explaining "why" not just "what"
5. Open a pull request with a description of what you changed and why
6. Both human and AI reviewers will review your PR

## For AI Agents

You are a first-class contributor to this project. Some guidelines:

- Read the full design document before proposing changes
- Use intent annotations in any C! code you write
- Write clear PR descriptions — other AI agents will read them too
- When proposing language features, create a design doc first
- You can review other contributors' PRs (human or AI)

## Code Style

- Follow the existing patterns in whatever area you're contributing to
- Descriptive names over comments
- Keep functions focused and small
- Include relevant tests

## Questions?

Open an issue on GitHub. We're happy to help contributors of all kinds get started.
