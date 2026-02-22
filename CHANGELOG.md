# Changelog

All notable changes to the C! project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Complete language design document ([design doc](docs/plans/2026-02-22-c-bang-language-design.md))
- Project website at [c-bang.integsec.com](https://c-bang.integsec.com)
- 5 demo applications (hello-world, todo-app, token-contract, chat-actors, fullstack-app)
- GitHub Wiki with 13 documentation pages
- `llms.txt` and `llms-full.txt` for AI discovery
- SEO-optimized static site with sitemap, robots.txt, structured data
- CLAUDE.md for AI contributor guidelines
- Contributing guide welcoming both human and AI contributors
- GitHub issue and PR templates
- 15 seed issues for contributors to pick up

### Design Decisions
- Linear/affine type system (no lifetime annotations)
- Actor model concurrency
- Multi-target compilation (native + WASM + EVM)
- Intent annotations verified by compiler
- Full-stack unified (backend, frontend, smart contracts)
- TypeScript bootstrap compiler (AI-accelerated)
- Apache 2.0 license
