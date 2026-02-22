# Getting Started with C!

## Installation

> **Note:** C! is currently in the design phase. The compiler is under active development. These instructions will work once the bootstrap compiler is released.

### Quick Install

```bash
# Coming soon
curl -fsSL https://c-bang.integsec.com/install.sh | sh
```

### Build from Source

```bash
git clone https://github.com/integsec/C-Bang.git
cd C-Bang/compiler
npm install
npm run build
```

## Your First C! Program

Create a file called `hello.cb`:

```
#[intent("Print a greeting to standard output")]
fn main() {
    print("Hello from C!");
}
```

Run it:

```bash
cbang run hello.cb
```

## Project Structure

A typical C! project looks like:

```
my-project/
├── src/
│   └── main.cb        # Entry point
├── tests/
│   └── main_test.cb   # Tests
└── cbang.toml         # Project configuration
```

Create a new project:

```bash
cbang new my-project
cd my-project
cbang run
```

## Key Concepts to Learn Next

1. **[Type System](Type-System)** — Ownership, refined types, algebraic data types
2. **[Intent Annotations](Intent-Annotations)** — How AI and compiler verify your code
3. **[Actor Model](Actor-Model)** — Concurrency without shared state
4. **[Full-Stack Web](Full-Stack-Web)** — Build web apps with one language

## Try the Demo Apps

The repository includes several demo applications:

| Demo | Description | Concepts |
|------|-------------|----------|
| [hello-world](https://github.com/integsec/C-Bang/tree/main/examples/demos/hello-world) | Basic syntax | Types, pattern matching |
| [todo-app](https://github.com/integsec/C-Bang/tree/main/examples/demos/todo-app) | Full-stack web app | Shared types, components, server |
| [token-contract](https://github.com/integsec/C-Bang/tree/main/examples/demos/token-contract) | ERC20 token | Smart contracts, verification |
| [chat-actors](https://github.com/integsec/C-Bang/tree/main/examples/demos/chat-actors) | Real-time chat | Actors, supervision, WebSocket |
| [fullstack-app](https://github.com/integsec/C-Bang/tree/main/examples/demos/fullstack-app) | Blog platform | Everything combined |
