# Actor Model

C! uses the actor model as its **only** concurrency primitive. No threads, no locks, no mutexes, no shared mutable state.

## What Is an Actor?

An actor is an isolated unit of computation that:
- Owns its state (no sharing)
- Communicates via typed messages
- Processes one message at a time
- Can spawn child actors
- Can supervise children for fault tolerance

## Basic Actor

```
actor Counter {
    state count: i64 = 0

    on Increment(by: i64) {
        count += by;
    }

    on GetCount() -> i64 {
        reply count;
    }

    on Reset() {
        count = 0;
    }
}

fn main() {
    let counter = spawn Counter();

    counter.send(Increment(5));     // fire-and-forget
    counter.send(Increment(3));

    let value = counter.ask(GetCount());  // await response
    assert!(value == 8);
}
```

## Message Types

- `send()` — Fire and forget. Does not wait for a response.
- `ask()` — Request/response. Awaits a reply from the actor.

## Supervision Trees

Actors can supervise child actors with restart strategies:

```
actor Application {
    // Always restart if it crashes
    supervise WebServer {
        restart: .always,
        max_restarts: 5 per .minute
    }

    // Restart everything if this critical service crashes
    supervise DatabasePool {
        restart: .always,
        on_failure: .restart_all
    }

    // Non-critical — let it die
    supervise MetricsCollector {
        restart: .never
    }
}
```

### Restart Strategies

| Strategy | Behavior |
|----------|----------|
| `.always` | Always restart the crashed actor |
| `.never` | Let the actor stay dead |
| `.restart_all` | Restart all supervised actors |
| `.exponential_backoff` | Restart with increasing delays |

## Structured Concurrency Within Actors

Actors can perform parallel work internally:

```
actor OrderProcessor {
    on ProcessOrder(order: own Order) -> Result<Receipt> {
        // Both tasks run in parallel
        // Both complete or both cancel
        let (stock, payment) = parallel {
            inventory.ask(CheckStock(order.items)),
            payments.ask(Authorize(order.total))
        };

        match (stock, payment) {
            (Available, Authorized(tx)) => {
                reply Ok(Receipt::new(order, tx))
            }
            _ => reply Err(OrderFailed)
        }
    }
}
```

## Channels (Streaming Between Actors)

```
actor DataPipeline {
    on StartPipeline(source: DataSource) {
        let (tx, rx) = channel::<Record>(buffer: 1000);
        spawn Producer(source, tx);
        spawn Consumer(rx, self);
    }
}
```

## What's Impossible

| Problem | Why It Can't Happen |
|---------|-------------------|
| Data race | No shared mutable state |
| Deadlock | No locks — message passing only |
| Orphan task | Structured concurrency scopes all work |
| Unhandled crash | Supervision trees catch and restart |
| Message type mismatch | Typed messages verified at compile time |
