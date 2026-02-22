# Intent Annotations

Intent annotations are C!'s defining feature — the bridge between human intent and AI-generated code, verified by the compiler.

## The Problem They Solve

When AI writes code, there's a trust gap:
- The human can't easily verify AI-generated code
- The AI can't prove its code is correct
- The intent behind the code is lost once written

Intent annotations close this gap.

## How They Work

```
#[intent("Transfer tokens between accounts,
         ensuring sender has sufficient balance,
         atomic — both sides update or neither does")]
#[invariant(total_supply_unchanged)]
#[pre(balances[from] >= amount)]
#[post(balances[to] == old(balances[to]) + amount)]
fn transfer(from: Address, to: Address, amount: u256) -> Result<Receipt> {
    verify!(balances[from] >= amount);
    balances[from] -= amount;
    balances[to] += amount;
    Ok(Receipt::new())
}
```

### The Annotations

| Annotation | Purpose |
|---|---|
| `#[intent("...")]` | Natural language description of what the function does |
| `#[pre(...)]` | Precondition — must be true before the function runs |
| `#[post(...)]` | Postcondition — must be true after the function runs |
| `#[invariant(...)]` | Must be true before AND after |
| `#[security(...)]` | Security-relevant properties (auth, rate limiting) |
| `#[author(...)]` | Who wrote this (human or AI agent) |

## Compiler Verification

The compiler checks annotations against implementation:

```
$ cbang check main.cb

✓ Type checking passed
✓ Ownership analysis passed
✓ Effect system verified
⚠ Intent mismatch on line 42:
  Intent says: "never store plaintext passwords"
  Code does:   password stored in user.log_entry
  Suggestion:  Use crypto::redact(password) before logging

✗ Postcondition violation on line 67:
  Post says:   balances[to] == old(balances[to]) + amount
  Code does:   balances[to] = amount  (overwrites instead of adding)
```

## AI-to-AI Communication

Intent annotations enable AI agents to understand and collaborate on codebases:

```
// Agent A writes this:
#[intent("Validate user registration input.
         Email must be valid format.
         Password: min 12 chars, 1 uppercase, 1 number, 1 special.
         Username: unique in database.")]
#[author(agent: "claude-opus", session: "abc123")]
fn validate_registration(input: RegistrationForm)
    -> Result<ValidatedForm, Vec<ValidationError>>
{
    // ...
}

// Agent B (days later) reads the intent and knows exactly:
// 1. What this function does
// 2. What constraints it enforces
// 3. Who wrote it and when
// 4. What the compiler has already verified
```

## Progressive Trust Levels

| Level | What's Verified | Use For |
|---|---|---|
| `#[intent]` only | Nothing (documentation) | Prototyping |
| `#[pre/post]` | Conditions checked | Business logic |
| `#[verify]` | Full formal proof | Contracts, financial code |
| `#[invariant]` | Always-true properties | State machines |

## Best Practices

1. **Always write intent** — even for simple functions
2. **Be specific** — "Transfer tokens" is too vague; include constraints
3. **Use pre/post for critical paths** — any function that handles money, auth, or data
4. **Use `#[verify]` for smart contracts** — formal proofs prevent million-dollar bugs
5. **Include security annotations** — `#[security(rate_limited, authenticated)]`
