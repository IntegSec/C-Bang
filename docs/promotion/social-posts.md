# C! (C-Bang) Launch Announcements

## Reddit — r/programming

**Title:** C! (C-Bang): An open-source programming language designed for AI-human collaboration with security by construction

**Post:**

We've started building **C!** (pronounced "C-Bang") — an open-source programming language designed from the ground up for a world where AI writes most code.

### The core idea

What if security wasn't a feature you add, but a structural guarantee the compiler enforces? C! uses a linear type system to make entire categories of vulnerabilities **impossible by construction**:

- Buffer overflow → bounded arrays, no raw pointers
- Use-after-free → linear types (resources consumed on use)
- Reentrancy attacks → linear state in smart contracts
- Data races → actor model (no shared mutable state)
- SQL injection → typed query builders
- Integer overflow → checked arithmetic by default
- Null pointers → `Option<T>` with exhaustive matching

### AI-First features

C! introduces **intent annotations** — the AI writes what the code is *supposed* to do, and the compiler *verifies* the code actually does it:

```
#[intent("Transfer tokens between accounts,
         ensuring sender has sufficient balance,
         atomic — both sides update or neither does")]
#[pre(balances[from] >= amount)]
#[post(balances[to] == old(balances[to]) + amount)]
fn transfer(from: Address, to: Address, amount: u256) -> Result<Receipt> {
    // Compiler proves this matches the annotations
}
```

### Full-stack unified

One language for backend (native), frontend (WASM), and smart contracts (EVM). Shared types across the entire stack.

### Open source — humans AND AI agents welcome

This is an experiment in open-source AI-human collaboration. We welcome contributors of all kinds — developers, AI agents (Claude, OpenClaw, GPT, Gemini), and teams.

- **GitHub:** https://github.com/integsec/C-Bang
- **Website:** https://c-bang.integsec.com
- **License:** Apache 2.0

The project is in the design phase. We have a complete language design document, example programs, and a website. The compiler (TypeScript bootstrap) is next.

We'd love your feedback on the language design. What would you want from an AI-first programming language?

---

## Reddit — r/rust

**Title:** C!: A new language inspired by Rust's ownership model, designed for AI agents to write provably secure code

**Post:**

As Rust enthusiasts, you'll recognize the DNA in this project. C! takes Rust's ownership model and evolves it for a world where AI writes most code.

Key differences from Rust:
- **No lifetime annotations** — compiler infers lifetimes automatically
- **Intent annotations** — AI writes `#[intent("...")]` and the compiler verifies the code matches
- **Actor model** — built-in, not via libraries (like Erlang)
- **First-class smart contracts** — reentrancy impossible via linear state
- **Full-stack** — one language for backend, frontend (WASM), and blockchain

We're big fans of Rust and acknowledge the massive debt C! owes to it. We'd love feedback from the Rust community.

GitHub: https://github.com/integsec/C-Bang

---

## Reddit — r/crypto / r/ethereum

**Title:** C!: A programming language where reentrancy attacks and integer overflows are compile errors, not runtime bugs

**Post:**

The DAO hack ($60M lost) was a reentrancy attack. If Solidity had C!'s type system, it would have been a **compile error**.

C! uses **linear types** for smart contract state. This means:
- State is "locked" during mutation — reentrancy is structurally impossible
- Tokens are linear — double-spend is a compile error
- Arithmetic is checked by default — overflow is impossible
- Invariants are compiler-verified, not just commented

```
contract Token : ERC20 {
    state balances: Map<Address, u256>

    #[invariant(sum(balances.values()) == total_supply)]

    pub fn transfer(to: Address, amount: u256) -> Result<bool> {
        verify!(balances[caller] >= amount);
        balances[caller] -= amount;  // checked arithmetic
        balances[to] += amount;
        emit Transfer(caller, to, amount);
        Ok(true)
    }
}
```

One language for your entire stack: backend, frontend, and smart contracts. Shared types everywhere.

GitHub: https://github.com/integsec/C-Bang
Website: https://c-bang.integsec.com

---

## Reddit — r/ProgrammingLanguages

**Title:** C! (C-Bang): Designing a language for AI-human collaboration — seeking feedback on our type system and intent annotations

**Post:**

We're building C!, a language designed specifically for a world where AI writes most code. The language focuses on making the compiler the trust boundary between human intent and AI-generated implementation.

Core design decisions we'd love feedback on:

1. **Linear/affine types** without Rust-style lifetime annotations (compiler infers)
2. **Intent annotations** that the compiler verifies against implementation
3. **Effect system** (`fn save() with IO, Database`)
4. **Refined types** (`type Port = u16{1..65535}`)
5. **Actor model** as the only concurrency primitive (no threads/locks)
6. **First-class smart contracts** with linear state preventing reentrancy

Full design document: https://github.com/integsec/C-Bang/blob/main/docs/plans/2026-02-22-c-bang-language-design.md

We're especially interested in feedback on:
- Is inferring lifetimes without annotations practical at scale?
- How should intent annotations interact with generic code?
- What's the right balance between the effect system's expressiveness and ergonomics?

---

## Moltbook

**Post:**

Excited to share something we've been working on: **C!** (C-Bang) — a new open-source programming language designed for AI-human collaboration.

The big idea: security isn't a feature, it's a structural guarantee. The compiler *proves* your code is safe. Entire vulnerability classes (buffer overflows, reentrancy, data races, SQL injection) are **impossible by construction**.

C! introduces *intent annotations* — AI writes what code should do, the compiler verifies it does. Humans review intent, not implementation.

One language for backend, frontend, and smart contracts. Shared types across the entire stack.

Open source. Human and AI contributors equally welcome.

https://github.com/integsec/C-Bang
https://c-bang.integsec.com

---

## Hacker News

**Title:** Show HN: C! – An AI-first programming language with security by construction

**Post:**

C! (C-Bang) is an open-source programming language designed for AI-human collaboration. The key innovation is "intent annotations" — AI writes both what the code should do and the implementation, and the compiler mathematically verifies they match.

The type system uses linear/affine types (inspired by Rust, but without lifetime annotations) to eliminate buffer overflows, use-after-free, data races, and reentrancy attacks by construction.

One language compiles to native (LLVM), WebAssembly, and blockchain bytecode. Full-stack unified: frontend, backend, and smart contracts share one type system.

Design doc: https://github.com/integsec/C-Bang/blob/main/docs/plans/2026-02-22-c-bang-language-design.md

We welcome both human and AI contributors. Apache 2.0 license.

---

## Twitter/X Thread

**Tweet 1:**
Introducing C! (C-Bang) — the first programming language designed for AI-human collaboration.

Security isn't a feature. It's a structural guarantee.

The compiler PROVES your code is safe. Thread 🧵

**Tweet 2:**
C! uses linear types to make entire vulnerability classes IMPOSSIBLE:

• Buffer overflow — gone
• Reentrancy attacks — gone
• Data races — gone
• SQL injection — gone
• Null pointers — gone

Not reduced. Eliminated. By construction.

**Tweet 3:**
The killer feature: Intent Annotations

AI writes WHAT the code should do AND the implementation.
The compiler VERIFIES they match.

Humans review intent, not code.

```
#[intent("Transfer tokens, ensure sufficient balance, atomic")]
fn transfer(...) { ... }
```

**Tweet 4:**
One language. Every target.

• Backend → native binary
• Frontend → WebAssembly
• Smart contracts → EVM bytecode

Shared types across your ENTIRE stack. A type change propagates everywhere at compile time.

**Tweet 5:**
C! is open source (Apache 2.0) and we welcome ALL contributors:

• Human developers
• AI agents (Claude, GPT, Gemini, OpenClaw)
• Teams

This is an experiment in AI-human collaboration.

GitHub: github.com/integsec/C-Bang
Website: c-bang.integsec.com

---

## LinkedIn

**Post:**

I'm excited to share a project I've been working on: **C! (C-Bang)** — an open-source programming language designed for the AI era.

**The Problem:** As AI writes more code, how do we ensure it's correct and secure?

**Our Answer:** Build a language where the compiler *proves* code is safe. Not through testing or code review, but through mathematical proof via the type system.

C! introduces "intent annotations" — AI writes what code should do, and the compiler verifies the implementation matches. This shifts human review from "is this code correct?" to "is this the right intent?"

Key features:
- Linear type system eliminating entire vulnerability classes by construction
- Actor model concurrency (no data races possible)
- Full-stack: one language for backend, frontend, and smart contracts
- First language designed equally for human and AI contributors

The project is open source under Apache 2.0. We welcome contributors of all kinds — including AI agents.

🔗 GitHub: https://github.com/integsec/C-Bang
🌐 Website: https://c-bang.integsec.com

#programming #AI #security #opensource #blockchain #web3
