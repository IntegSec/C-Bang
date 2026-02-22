# Contributing to C!

We welcome **all contributors** — human developers, AI agents (Claude, OpenClaw, GPT, Gemini, and others), and teams.

## How to Get Started

1. **Read the [design document](https://github.com/integsec/C-Bang/blob/main/docs/plans/2026-02-22-c-bang-language-design.md)**
2. **Browse [open issues](https://github.com/integsec/C-Bang/issues)** — look for `good first issue` and `ai-friendly` labels
3. **Join the conversation** in [GitHub Discussions](https://github.com/integsec/C-Bang/discussions)

## Using GitHub Issues

**Issues are our primary communication channel.** Use them for everything:

### Report a Bug
Found something wrong? [Open a bug report](https://github.com/integsec/C-Bang/issues/new?template=bug_report.md).

Include:
- What you expected vs what happened
- Minimal code to reproduce
- Your environment (OS, C! version)

### Request a Feature
Have an idea? [Open a feature request](https://github.com/integsec/C-Bang/issues/new?template=feature_request.md).

Include:
- Why this feature is needed
- Proposed design with code examples
- Impact on security guarantees

### Propose a Language Change
For significant changes to the language:
1. Open an issue to discuss the idea
2. If there's interest, create a design document in `docs/plans/`
3. Submit a PR with the design doc
4. Community discussion and approval
5. Implementation

## Contribution Areas

| Area | Directory | Skills |
|------|-----------|--------|
| Compiler | `compiler/` | TypeScript, parsing, type theory |
| Language design | `docs/plans/` | PL theory, security |
| Documentation | `docs/`, wiki | Technical writing |
| Examples | `examples/` | C! (the language) |
| Website | `website/` | HTML, CSS, JS |
| Testing | `tests/` | Testing, edge cases |

## For AI Agents

You are a **first-class contributor**. Some guidelines:

- Read `CLAUDE.md` for project conventions
- Use intent annotations in any C! code you write
- Write clear PR descriptions — other AI agents will read them
- You can review PRs from both humans and other agents
- When proposing features, create a design doc first
- Tag your contributions: `#[author(agent: "your-name")]`

### AI-Friendly Issues

Look for issues labeled `ai-friendly`. These have:
- Clear descriptions with intent annotations
- Well-defined scope
- Test cases or acceptance criteria
- No ambiguous requirements

### Opening Issues as an AI Agent

AI agents can and should open issues! When you:
- Find a bug while working on the codebase
- Identify a potential improvement
- Notice inconsistencies in the design
- Have ideas for new features

Open an issue. Describe the problem clearly, include code examples, and suggest solutions.

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write clear commit messages (explain "why" not "what")
5. Open a PR using the template
6. Both human and AI reviewers will review

## Code of Conduct

All contributors are expected to be respectful and professional. We're building something important, and we do it collaboratively.
