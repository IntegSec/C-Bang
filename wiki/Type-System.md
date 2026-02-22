# Type System

C!'s type system is the foundation of its security guarantees. It combines linear types, refined types, algebraic data types, and an effect system.

## Ownership Model (Linear/Affine Types)

Every value in C! has exactly one owner. When a value is used, ownership transfers:

```
// OWNED — default. The holder owns the resource.
let token = Token::mint(100);
transfer(token, alice);           // ownership moves to transfer()
// token is GONE here — compile error to use it

// BORROWED — temporary read access
fn display(user: &User) {
    print(user.name);
}   // borrow ends, caller still owns User

// SHARED — multiple readers, no writers
let config = shared Config::load();
spawn actor1(config);             // both actors can read
spawn actor2(config);             // neither can modify

// UNIQUE MUTABLE — exactly one writer
fn update(db: &mut Database) {
    db.insert(record);            // exclusive access guaranteed
}
```

### Key Simplification vs Rust

C! does **not** require lifetime annotations. The compiler infers lifetimes automatically:

```
// Rust requires: fn longest<'a>(x: &'a str, y: &'a str) -> &'a str
// C! infers it:
fn longest(x: &String, y: &String) -> &String {
    if x.len() > y.len() { x } else { y }
}

// When inference fails, use explicit scoping:
fn complex() {
    scope data = load_data() {
        process(&data);
    }  // data released here
}
```

## Refined Types

Types carry value constraints checked at compile time:

```
type Port = u16{1..65535}
type Percentage = f64{0.0..=100.0}
type Username = String{len: 1..50, matches: r"^[a-zA-Z0-9_]+$"}
type NonEmpty<T> = Vec<T>{len: 1..}

fn serve(port: Port) { ... }
serve(0);       // COMPILE ERROR: 0 is not in 1..65535
serve(8080);    // OK
```

## Algebraic Data Types

### Sum Types (Enums with Data)

```
type Result<T, E> = Ok(T) | Err(E)
type Option<T> = Some(T) | None

type Shape =
    | Circle(radius: f64)
    | Rectangle(width: f64, height: f64)
    | Triangle(a: f64, b: f64, c: f64)
```

### Product Types (Structs)

```
type User {
    id: UUID,
    name: Username,
    email: Email,
    role: Admin | Editor | Viewer,  // inline union
}
```

### Pattern Matching

Pattern matching is always exhaustive:

```
match shape {
    Circle(r)          => pi * r * r,
    Rectangle(w, h)    => w * h,
    Triangle(a, b, c)  => herons_formula(a, b, c),
    // Compile error if any case is missing
}
```

## Effect System

Functions declare their side effects:

```
// Pure — no side effects, can be memoized/parallelized
pure fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Effects are explicit
fn save_user(user: User) -> Result<()> with IO, Database {
    db.insert(user)
}

// Calling effectful from pure = COMPILE ERROR
pure fn compute(user: User) -> Score {
    save_user(user);   // ERROR: cannot perform IO in pure function
}
```

## Built-in Types

| Type | Description |
|------|-------------|
| `bool` | Boolean |
| `i8`, `i16`, `i32`, `i64`, `i128` | Signed integers |
| `u8`, `u16`, `u32`, `u64`, `u128`, `u256` | Unsigned integers |
| `f32`, `f64` | Floating point |
| `String` | UTF-8 string |
| `Vec<T>` | Dynamic array |
| `Map<K, V>` | Hash map |
| `Option<T>` | Optional value (no null) |
| `Result<T, E>` | Success or error |
| `UUID` | Universally unique identifier |
| `DateTime` | Date and time |
| `Address` | Blockchain address |
| `Hash` | Cryptographic hash |
