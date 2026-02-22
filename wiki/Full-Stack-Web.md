# Full-Stack Web Development

C! is a full-stack language. One codebase, one type system, three targets: backend (native), frontend (WASM), and smart contracts (blockchain).

## Shared Types

Types defined once are used everywhere:

```
type User {
    id: UUID,
    name: String{len: 1..100},
    email: Email,
    role: Admin | Editor | Viewer,
}
```

Change this type → compiler shows every place that needs updating across frontend, backend, and contracts.

## Backend

```
server App {
    bind: "0.0.0.0:8080"

    middleware [
        Cors { origins: ["https://myapp.com"] },
        RateLimit { max: 100 per .minute },
        Auth { strategy: JWT },
    ]

    #[get("/users/:id")]
    #[auth(Role::Viewer)]
    fn get_user(id: UUID) -> Result<User, ApiError> with Database {
        db.find::<User>(id).ok_or(NotFound("User not found"))
    }

    #[post("/users")]
    #[auth(Role::Admin)]
    #[validate]
    fn create_user(body: User) -> Result<User, ApiError> with Database {
        db.insert(body)
    }

    // WebSocket support
    #[ws("/feed")]
    fn live_feed(conn: WebSocket, user: AuthUser) {
        let feed = spawn FeedActor(user.id);
        conn.pipe(feed);
    }
}
```

## Frontend

Components compile to WASM and run in the browser:

```
state AppState {
    current_user: Option<User> = None,
    theme: Theme = Theme::Light,
}

component UserProfile(user: User) {
    style {
        .profile { padding: 2rem; }
        .name { font-size: 1.5rem; font-weight: bold; }
    }

    <div class="profile">
        <h1 class="name">{user.name}</h1>
        <p>{user.email}</p>
        <RoleBadge role={user.role} />
    </div>
}

component RoleBadge(role: Role) {
    let color = match role {
        Admin  => "red",
        Editor => "blue",
        Viewer => "gray",
    };

    <span style="color: {color}">{role.to_string()}</span>
}
```

### Routing

```
router {
    "/"           => HomePage,
    "/users/:id"  => UserProfile(id),
    "/settings"   => Settings [auth: Role::Viewer],
    _             => NotFound,
}
```

### Reactive State

```
component Counter {
    state count: i32 = 0

    <div>
        <button on:click={|| count -= 1}>"-"</button>
        <span>{count}</span>
        <button on:click={|| count += 1}>"+"</button>
    </div>
}
```

## Cross-Layer Communication

The same types flow through all layers:

```
// 1. Contract emits event
contract Token {
    pub fn transfer(...) {
        emit Transfer(from, to, amount);
    }
}

// 2. Server indexes it
server App {
    #[on_event(Token::Transfer)]
    fn index_transfer(event: Transfer) with Database {
        db.insert(TransferRecord::from(event));
    }
}

// 3. Frontend displays it
component TransferFeed {
    let transfers = subscribe("/transfers");

    <ul>
        {for t in transfers {
            <li>"{t.from} → {t.to}: {t.amount}"</li>
        }}
    </ul>
}
```

## Build Commands

```bash
# Build everything
cbang build

# Build specific target
cbang build --target native    # Backend binary
cbang build --target wasm      # Frontend WASM
cbang build --target evm       # Smart contracts

# Development server with hot reload
cbang dev
```
