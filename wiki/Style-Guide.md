# C! Style Guide

Conventions for writing clean, consistent C! code.

## Naming

| Item | Convention | Example |
|------|-----------|---------|
| Variables | `snake_case` | `user_count` |
| Functions | `snake_case` | `get_user` |
| Types | `PascalCase` | `UserProfile` |
| Constants | `SCREAMING_SNAKE` | `MAX_RETRY` |
| Modules | `snake_case` | `auth_service` |
| Actors | `PascalCase` | `OrderProcessor` |
| Contracts | `PascalCase` | `TokenVault` |
| Components | `PascalCase` | `UserCard` |

## Formatting

- 4-space indentation
- Opening braces on same line
- Trailing commas in multi-line constructs
- Max line length: 100 characters

```
// Good
fn process_order(order: Order) -> Result<Receipt> {
    let items = order.items.filter(|i| i.available);
    // ...
}

// Bad
fn process_order(order: Order) -> Result<Receipt>
{
    let items = order.items.filter(|i| i.available);
}
```

## Intent Annotations

Always include intent annotations on:
- Public functions
- Functions that handle money, auth, or sensitive data
- Contract functions
- Any function with non-obvious behavior

```
// Good
#[intent("Validate email format and check uniqueness in database")]
pub fn validate_email(email: Email) -> Result<ValidEmail> with Database { ... }

// Acceptable (private, obvious behavior)
fn add(a: i32, b: i32) -> i32 { a + b }
```

## Error Handling

Use `Result<T, E>` for operations that can fail. Use `verify!` for preconditions:

```
// Good
fn withdraw(amount: u256) -> Result<Receipt> {
    verify!(amount > 0, "Amount must be positive");
    verify!(balance >= amount, "Insufficient funds");
    // ...
}

// Bad — panics instead of returning Result
fn withdraw(amount: u256) -> Receipt {
    assert!(amount > 0);  // Don't panic in library code
}
```

## Actors

One actor per concern. Keep message handlers short:

```
// Good — focused actor
actor PaymentProcessor {
    on ProcessPayment(payment: Payment) -> Result<Receipt> { ... }
    on RefundPayment(receipt: Receipt) -> Result<Refund> { ... }
}

// Bad — god actor
actor Everything {
    on ProcessPayment(...) { ... }
    on SendEmail(...) { ... }
    on UpdateInventory(...) { ... }
    on GenerateReport(...) { ... }
}
```
