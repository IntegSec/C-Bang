// C! Playground — browser-based compiler and runner
//
// Security note: This playground intentionally executes user-authored C! code
// compiled to JavaScript.  The execution happens entirely client-side in the
// user's own browser — no server is involved and no untrusted third-party
// code is evaluated.  The use of the Function constructor below is the
// standard approach for browser-based language playgrounds (e.g., the Rust,
// Go, and TypeScript playgrounds all do the same).

const EXAMPLES = {
  hello: `// Hello World — your first C! program
// Demonstrates: effect system (with IO), string interpolation

fn main() with IO {
    let lang = "C!";
    println!("Hello from {lang}");
    println!("A language built for AI-human collaboration.");
}`,

  fibonacci: `// Fibonacci — pure functions and effect tracking
// Demonstrates: pure keyword, intent annotations, string interpolation

#[intent("compute the nth Fibonacci number recursively")]
pure fn fib(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

fn main() with IO {
    let result = fib(10);
    println!("fib(10) = {result}");
}`,

  actor: `// Counter Actor — message-driven concurrency
// Demonstrates: actor model, state, intent annotations, emit/reply

actor Counter {
    state count: i32 = 0

    #[intent("increment the counter by one")]
    on Increment() {
        count += 1;
        emit CountChanged(count);
    }

    #[intent("reset the counter to zero")]
    on Reset() {
        count = 0;
        emit CountChanged(count);
    }

    #[intent("return the current count")]
    on GetCount() {
        reply count;
    }
}

fn main() with IO {
    let c = Counter();
    println!("Created Counter actor");

    c.onIncrement();
    c.onIncrement();
    c.onIncrement();
    println!("After 3 increments: count = {c.onGetCount()}");

    c.onReset();
    println!("After reset: count = {c.onGetCount()}");

    c.onIncrement();
    println!("After 1 more increment: count = {c.onGetCount()}");
}`,

  pattern: `// Pattern Matching — enums and exhaustive matching
// Demonstrates: enum variants, pattern matching, pure functions, intents

enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

#[intent("compute the area of any shape")]
pure fn area(s: Shape) -> f64 {
    match s {
        Circle(r) => { return 3.14159 * r * r; },
        Rect(w, h) => { return w * h; },
    }
}

#[intent("describe a shape in human-readable form")]
pure fn describe(s: Shape) -> String {
    match s {
        Circle(r) => { return "circle"; },
        Rect(w, h) => { return "rectangle"; },
    }
}

fn main() with IO {
    let c = Circle(5.0);
    let r = Rect(4.0, 6.0);

    println!("Shape 1: {describe(c)} with area {area(c)}");
    println!("Shape 2: {describe(r)} with area {area(r)}");

    let big = Circle(10.0);
    println!("Big circle area: {area(big)}");
}`,

  chat: `// Chat Application — actors for real-time messaging
// Demonstrates: multiple actors, intent annotations, emit/reply

type Message {
    sender: String,
    text: String,
}

actor ChatRoom {
    state members: i32 = 0
    state message_count: i32 = 0

    #[intent("register a new user in the chat room")]
    on Join(name: String) {
        members += 1;
        emit UserJoined(name, members);
    }

    #[intent("remove a user from the chat room")]
    on Leave(name: String) {
        members -= 1;
        emit UserLeft(name, members);
    }

    #[intent("broadcast a message to all room members")]
    on SendMessage(sender: String, text: String) {
        message_count += 1;
        emit NewMessage(sender, text, message_count);
    }

    #[intent("return current member count")]
    on GetStats() {
        reply members;
    }

    #[intent("return total messages sent")]
    on GetMessageCount() {
        reply message_count;
    }
}

fn main() with IO {
    let room = ChatRoom();
    println!("=== C! Chat Room ===");

    room.onJoin("Alice");
    println!("Alice joined  — members: {room.onGetStats()}");

    room.onJoin("Bob");
    println!("Bob joined    — members: {room.onGetStats()}");

    room.onJoin("Charlie");
    println!("Charlie joined — members: {room.onGetStats()}");

    room.onSendMessage("Alice", "Hello everyone!");
    room.onSendMessage("Bob", "Hey Alice!");
    room.onSendMessage("Charlie", "Great to be here!");
    println!("Messages sent: {room.onGetMessageCount()}");

    room.onLeave("Charlie");
    println!("Charlie left  — members: {room.onGetStats()}");

    println!("Final stats: {room.onGetStats()} members, {room.onGetMessageCount()} messages");
}`,

  contract: `// Token Contract — ERC20-style token with minting and transfers
// Demonstrates: contracts, intent annotations, pure functions, emit/reply

contract Token {
    state name: String
    state symbol: String
    state total_supply: u256 = 0

    #[intent("create new tokens and increase supply")]
    pub fn mint(amount: u256) {
        total_supply += amount;
        emit Minted(amount, total_supply);
    }

    #[intent("burn tokens and decrease supply")]
    pub fn burn(amount: u256) {
        total_supply -= amount;
        emit Burned(amount, total_supply);
    }

    #[intent("return the current total token supply")]
    pub fn get_supply() {
        reply total_supply;
    }

    #[intent("return the token name")]
    pub fn get_name() {
        reply name;
    }
}

contract NFTMarketplace {
    state listing_count: u256 = 0
    state fee_percent: u256 = 2

    #[intent("list an NFT for sale at a given price")]
    pub fn list_item(token_id: u256, price: u256) {
        listing_count += 1;
        emit ItemListed(token_id, price, listing_count);
    }

    #[intent("return total number of listings")]
    pub fn get_listings() {
        reply listing_count;
    }

    #[intent("compute marketplace fee for a given price")]
    pub pure fn calculate_fee(price: u256) -> u256 {
        return price * fee_percent / 100;
    }
}

fn main() with IO {
    let token = Token();
    token.name = "CBangCoin";
    token.symbol = "CBC";
    println!("=== {token.get_name()} ({token.symbol}) ===");

    token.mint(1000);
    println!("Minted 1000 tokens — supply: {token.get_supply()}");

    token.mint(500);
    println!("Minted 500 more   — supply: {token.get_supply()}");

    token.burn(200);
    println!("Burned 200 tokens — supply: {token.get_supply()}");

    let market = NFTMarketplace();
    println!("");
    println!("=== NFT Marketplace ===");
    market.list_item(1, 100);
    market.list_item(2, 250);
    market.list_item(3, 500);
    println!("Listed 3 NFTs — total listings: {market.get_listings()}");

    let fee = market.calculate_fee(500);
    println!("Fee on 500 token sale: {fee}");
}`,

  spirograph: `// Spirograph — Rainbow Generative Art
// Demonstrates: pure functions, math builtins, canvas animation, string interpolation

state t: f64 = 0.0
state hue: f64 = 0.0

#[intent("compute x position of spirograph curve")]
pure fn spiro_x(t: f64, r1: f64, r2: f64, p: f64) -> f64 {
    return (r1 - r2) * math_cos!(t) + p * math_cos!((r1 - r2) * t / r2);
}

#[intent("compute y position of spirograph curve")]
pure fn spiro_y(t: f64, r1: f64, r2: f64, p: f64) -> f64 {
    return (r1 - r2) * math_sin!(t) - p * math_sin!((r1 - r2) * t / r2);
}

#[intent("render one frame of the spirograph animation")]
fn frame() {
    let mut i = 0;
    while i < 12 {
        let x1 = 200.0 + spiro_x(t, 125.0, 47.0, 42.0);
        let y1 = 200.0 + spiro_y(t, 125.0, 47.0, 42.0);
        let x2 = 200.0 + spiro_x(t * 1.1, 100.0, 63.0, 55.0) * 0.8;
        let y2 = 200.0 + spiro_y(t * 1.1, 100.0, 63.0, 55.0) * 0.8;

        let r = math_floor!(127.0 + 127.0 * math_sin!(hue));
        let g = math_floor!(127.0 + 127.0 * math_sin!(hue + 2.094));
        let b = math_floor!(127.0 + 127.0 * math_sin!(hue + 4.189));
        canvas_fill_style!("rgb({r},{g},{b})");
        canvas_circle!(x1, y1, 1.8);

        let r2c = math_floor!(127.0 + 127.0 * math_sin!(hue + 3.14));
        let g2c = math_floor!(127.0 + 127.0 * math_sin!(hue + 5.234));
        let b2c = math_floor!(127.0 + 127.0 * math_sin!(hue + 1.047));
        canvas_fill_style!("rgb({r2c},{g2c},{b2c})");
        canvas_circle!(x2, y2, 1.4);

        t = t + 0.019;
        hue = hue + 0.004;
        i = i + 1;
    }
}

fn main() with IO {
    canvas_size!(400, 400);
    canvas_fill_style!("#0a0a1a");
    canvas_fill_rect!(0.0, 0.0, 400.0, 400.0);
    canvas_font!("14px monospace");
    canvas_fill_style!("rgba(255,255,255,0.6)");
    canvas_text!("C! Spirograph", 152.0, 20.0);
    canvas_font!("11px monospace");
    canvas_fill_style!("rgba(85,85,119,0.6)");
    canvas_text!("pure fn + math builtins + canvas_animate!", 68.0, 390.0);
    println!("Rainbow spirograph — pure functions + canvas animation!");
    canvas_animate!(frame);
}`,

  waves: `// Wave Visualizer — Animated Sine Waves
// Demonstrates: while loops, math builtins, canvas animation, pure fn

state time: f64 = 0.0

#[intent("compute composite wave height at position x")]
pure fn wave(x: f64, t: f64, freq: f64, amp: f64, phase: f64) -> f64 {
    return amp * math_sin!(x * freq + t + phase);
}

#[intent("render one animation frame of layered waves")]
fn frame() {
    canvas_fill_style!("rgba(10,10,30,0.15)");
    canvas_fill_rect!(0.0, 0.0, 400.0, 400.0);

    let mut x = 0.0;
    while x < 400.0 {
        let y1 = 100.0 + wave(x, time, 0.025, 40.0, 0.0) + wave(x, time * 0.7, 0.04, 20.0, 1.5);
        let y2 = 200.0 + wave(x, time * 1.3, 0.02, 50.0, 0.8) + wave(x, time * 0.5, 0.05, 15.0, 3.0);
        let y3 = 300.0 + wave(x, time * 0.9, 0.03, 35.0, 2.1) + wave(x, time * 1.1, 0.015, 25.0, 4.5);

        canvas_fill_style!("#00ffff");
        canvas_circle!(x, y1, 1.5);

        canvas_fill_style!("#ff00ff");
        canvas_circle!(x, y2, 1.5);

        canvas_fill_style!("#ffff00");
        canvas_circle!(x, y3, 1.5);

        x = x + 3.0;
    }

    canvas_font!("16px monospace");
    canvas_fill_style!("#00ff88");
    canvas_text!("C! Wave Visualizer", 110.0, 30.0);

    time = time + 0.04;
}

fn main() with IO {
    canvas_size!(400, 400);
    canvas_fill_style!("#0a0a1e");
    canvas_fill_rect!(0.0, 0.0, 400.0, 400.0);
    println!("Wave visualizer — layered sine waves with trail effect!");
    canvas_animate!(frame);
}`,

  mandelbrot: `// Mandelbrot Fractal — pure computation meets canvas rendering
// Demonstrates: nested while loops, pure functions, intents, string interpolation

#[intent("compute Mandelbrot escape iteration for complex point (cr, ci)")]
pure fn mandelbrot(cr: f64, ci: f64) -> f64 {
    let mut zr = 0.0;
    let mut zi = 0.0;
    let mut i = 0.0;
    let mut esc = 80.0;
    while i < 80.0 {
        let tr = zr * zr - zi * zi + cr;
        zi = 2.0 * zr * zi + ci;
        zr = tr;
        if zr * zr + zi * zi > 4.0 {
            if esc > 79.0 {
                esc = i;
            }
        }
        i = i + 1.0;
    }
    return esc;
}

#[intent("map iteration count to a red color component")]
pure fn col_r(n: f64) -> f64 {
    return math_floor!(127.0 + 127.0 * math_sin!(n * 0.12));
}

#[intent("map iteration count to a green color component")]
pure fn col_g(n: f64) -> f64 {
    return math_floor!(127.0 + 127.0 * math_sin!(n * 0.12 + 2.094));
}

#[intent("map iteration count to a blue color component")]
pure fn col_b(n: f64) -> f64 {
    return math_floor!(127.0 + 127.0 * math_sin!(n * 0.12 + 4.189));
}

fn main() with IO {
    canvas_size!(400, 400);
    println!("Rendering Mandelbrot fractal...");

    let mut py = 0.0;
    while py < 100.0 {
        let mut px = 0.0;
        while px < 100.0 {
            let cr = (px - 65.0) / 35.0;
            let ci = (py - 50.0) / 35.0;
            let n = mandelbrot(cr, ci);
            if n < 79.0 {
                let r = col_r(n);
                let g = col_g(n);
                let b = col_b(n);
                canvas_fill_style!("rgb({r},{g},{b})");
            } else {
                canvas_fill_style!("#000000");
            }
            canvas_fill_rect!(px * 4.0, py * 4.0, 4.0, 4.0);
            px = px + 1.0;
        }
        py = py + 1.0;
    }

    canvas_font!("16px monospace");
    canvas_fill_style!("#ffffff");
    canvas_text!("C! Mandelbrot", 140.0, 25.0);
    canvas_font!("11px monospace");
    canvas_fill_style!("#888888");
    canvas_text!("pure fn + nested while loops + 80 iterations/pixel", 52.0, 390.0);
    println!("Mandelbrot fractal rendered — 10,000 pixels, 80 iterations each!");
}`,

  minigame: `// Mini Game — Catch the Falling Square
// Demonstrates: input macros, audio, canvas, game loop, math builtins

state player_x: f64 = 175.0
state target_x: f64 = 100.0
state target_y: f64 = 0.0
state score: i32 = 0
state speed: f64 = 3.0

#[intent("update game state each frame")]
fn update(dt: f64) {
    if key_is_down!("ArrowLeft") { player_x = player_x - 200.0 * dt; }
    if key_is_down!("ArrowRight") { player_x = player_x + 200.0 * dt; }
    if mouse_is_down!() { player_x = mouse_x!() - 25.0; }
    if touch_is_active!() { player_x = touch_x!() - 25.0; }
    if player_x < 0.0 { player_x = 0.0; }
    if player_x > 350.0 { player_x = 350.0; }
    target_y = target_y + speed * 60.0 * dt;
    if target_y > 400.0 {
        target_y = 0.0;
        target_x = math_floor!(math_random!() * 350.0);
        speed = speed + 0.2;
    }
    if target_y > 350.0 {
        let dx: f64 = target_x - player_x;
        if dx > 0.0 - 50.0 { if dx < 50.0 {
            score = score + 1;
            sfx_coin!();
            target_y = 0.0;
            target_x = math_floor!(math_random!() * 350.0);
        } }
    }
}

#[intent("render the game scene")]
fn render() {
    canvas_fill_style!("#1a1a2e");
    canvas_fill_rect!(0.0, 0.0, 400.0, 400.0);
    canvas_fill_style!("#e94560");
    canvas_fill_rect!(target_x, target_y, 30.0, 30.0);
    canvas_fill_style!("#0f3460");
    canvas_fill_rect!(player_x, 360.0, 50.0, 30.0);
    canvas_font!("16px monospace");
    canvas_fill_style!("#ffffff");
    canvas_text!("Score: {score}", 10.0, 25.0);
    canvas_font!("11px monospace");
    canvas_fill_style!("#555577");
    canvas_text!("Arrow keys or mouse to move", 100.0, 390.0);
}

fn setup() {
    audio_init!();
    scene_register!("game", setup, update, render);
    scene_switch!("game");
}

fn main() with IO {
    game_init!(400, 400, setup);
    game_run!();
    println!("Mini Game — catch the falling squares!");
}`,

  spinning: `// 3D Spinning Cube — animated canvas with starfield
// Demonstrates: state, canvas_animate!, math builtins, intents

// Global state for animation
state angle: f64 = 0.0
state sx0: f64 = 0.0
state sy0: f64 = 0.0
state sb0: f64 = 0.0
state sx1: f64 = 0.0
state sy1: f64 = 0.0
state sb1: f64 = 0.0
state sx2: f64 = 0.0
state sy2: f64 = 0.0
state sb2: f64 = 0.0
state sx3: f64 = 0.0
state sy3: f64 = 0.0
state sb3: f64 = 0.0
state sx4: f64 = 0.0
state sy4: f64 = 0.0
state sb4: f64 = 0.0
state sx5: f64 = 0.0
state sy5: f64 = 0.0
state sb5: f64 = 0.0
state sx6: f64 = 0.0
state sy6: f64 = 0.0
state sb6: f64 = 0.0
state sx7: f64 = 0.0
state sy7: f64 = 0.0
state sb7: f64 = 0.0
state sx8: f64 = 0.0
state sy8: f64 = 0.0
state sb8: f64 = 0.0
state sx9: f64 = 0.0
state sy9: f64 = 0.0
state sb9: f64 = 0.0

#[intent("draw a star dot at given position")]
fn draw_star(x: f64, y: f64, b: f64) {
    canvas_fill_style!("#ffffff");
    canvas_circle!(x, y, 0.5 + b * 1.5);
}

#[intent("draw a colored edge between two rotated 3D points")]
fn draw_edge(x1: f64, y1: f64, z1: f64, x2: f64, y2: f64, z2: f64, ay: f64, ax: f64, color: String) {
    let cy = math_cos!(ay); let sny = math_sin!(ay);
    let cx = math_cos!(ax); let snx = math_sin!(ax);
    let d = 5.0;
    let a1 = x1 * cy + z1 * sny;
    let b1 = z1 * cy - x1 * sny;
    let c1 = y1 * cx - b1 * snx;
    let d1 = b1 * cx + y1 * snx;
    let p1 = d / (d + d1);
    let a2 = x2 * cy + z2 * sny;
    let b2 = z2 * cy - x2 * sny;
    let c2 = y2 * cx - b2 * snx;
    let d2 = b2 * cx + y2 * snx;
    let p2 = d / (d + d2);
    canvas_stroke_style!(color);
    canvas_line_width!(2.0);
    canvas_line!(200.0 + a1 * p1 * 100.0, 200.0 + c1 * p1 * 100.0, 200.0 + a2 * p2 * 100.0, 200.0 + c2 * p2 * 100.0);
}

#[intent("render wireframe cube at given rotation angles")]
fn draw_cube(ay: f64, ax: f64) {
    draw_edge(0.0-1.0,0.0-1.0,0.0-1.0, 1.0,0.0-1.0,0.0-1.0, ay,ax,"#00ffff");
    draw_edge(1.0,0.0-1.0,0.0-1.0, 1.0,1.0,0.0-1.0, ay,ax,"#00ffff");
    draw_edge(1.0,1.0,0.0-1.0, 0.0-1.0,1.0,0.0-1.0, ay,ax,"#00ffff");
    draw_edge(0.0-1.0,1.0,0.0-1.0, 0.0-1.0,0.0-1.0,0.0-1.0, ay,ax,"#00ffff");
    draw_edge(0.0-1.0,0.0-1.0,1.0, 1.0,0.0-1.0,1.0, ay,ax,"#ff00ff");
    draw_edge(1.0,0.0-1.0,1.0, 1.0,1.0,1.0, ay,ax,"#ff00ff");
    draw_edge(1.0,1.0,1.0, 0.0-1.0,1.0,1.0, ay,ax,"#ff00ff");
    draw_edge(0.0-1.0,1.0,1.0, 0.0-1.0,0.0-1.0,1.0, ay,ax,"#ff00ff");
    draw_edge(0.0-1.0,0.0-1.0,0.0-1.0, 0.0-1.0,0.0-1.0,1.0, ay,ax,"#ffff00");
    draw_edge(1.0,0.0-1.0,0.0-1.0, 1.0,0.0-1.0,1.0, ay,ax,"#ffff00");
    draw_edge(1.0,1.0,0.0-1.0, 1.0,1.0,1.0, ay,ax,"#ffff00");
    draw_edge(0.0-1.0,1.0,0.0-1.0, 0.0-1.0,1.0,1.0, ay,ax,"#ffff00");
}

#[intent("render one animation frame: starfield + spinning cube")]
fn frame() {
    canvas_fill_style!("#0a0a2e");
    canvas_fill_rect!(0.0, 0.0, 400.0, 400.0);
    draw_star(sx0,sy0,sb0); draw_star(sx1,sy1,sb1);
    draw_star(sx2,sy2,sb2); draw_star(sx3,sy3,sb3);
    draw_star(sx4,sy4,sb4); draw_star(sx5,sy5,sb5);
    draw_star(sx6,sy6,sb6); draw_star(sx7,sy7,sb7);
    draw_star(sx8,sy8,sb8); draw_star(sx9,sy9,sb9);
    draw_cube(angle, angle * 0.6);
    canvas_font!("16px monospace");
    canvas_fill_style!("#00ff88");
    canvas_text!("C! 3D Cube", 148.0, 30.0);
    canvas_font!("11px monospace");
    canvas_fill_style!("#555577");
    canvas_text!("canvas_animate! + math builtins", 100.0, 390.0);
    angle = angle + 0.012;
}

fn main() with IO {
    canvas_size!(400, 400);
    sx0 = math_random!() * 400.0; sy0 = math_random!() * 400.0; sb0 = 0.3 + math_random!() * 0.7;
    sx1 = math_random!() * 400.0; sy1 = math_random!() * 400.0; sb1 = 0.3 + math_random!() * 0.7;
    sx2 = math_random!() * 400.0; sy2 = math_random!() * 400.0; sb2 = 0.3 + math_random!() * 0.7;
    sx3 = math_random!() * 400.0; sy3 = math_random!() * 400.0; sb3 = 0.3 + math_random!() * 0.7;
    sx4 = math_random!() * 400.0; sy4 = math_random!() * 400.0; sb4 = 0.3 + math_random!() * 0.7;
    sx5 = math_random!() * 400.0; sy5 = math_random!() * 400.0; sb5 = 0.3 + math_random!() * 0.7;
    sx6 = math_random!() * 400.0; sy6 = math_random!() * 400.0; sb6 = 0.3 + math_random!() * 0.7;
    sx7 = math_random!() * 400.0; sy7 = math_random!() * 400.0; sb7 = 0.3 + math_random!() * 0.7;
    sx8 = math_random!() * 400.0; sy8 = math_random!() * 400.0; sb8 = 0.3 + math_random!() * 0.7;
    sx9 = math_random!() * 400.0; sy9 = math_random!() * 400.0; sb9 = 0.3 + math_random!() * 0.7;
    println!("3D spinning cube with starfield!");
    canvas_animate!(frame);
}`,
};

// ── Game Engine Runtime Strings ──────────────────────────────────────────────
// Extracted from compiler/src/codegen/runtime/*-runtime.ts
// These are injected into the sandbox iframe when the generated code uses them.

var INPUT_RUNTIME = '\n' +
'var __input = (function() {\n' +
'  var keys = {};\n' +
'  var justPressed = {};\n' +
'  var justReleased = {};\n' +
'  var mouseState = { x: 0, y: 0, down: false, justClicked: false };\n' +
'  var touchState = { x: 0, y: 0, active: false, count: 0 };\n' +
'  var gamepadState = { connected: false, axes: [0,0,0,0], buttons: [] };\n' +
'  var callbacks = { keydown: [], keyup: [], mousemove: [], mouseclick: [], touchstart: [], touchmove: [], touchend: [] };\n' +
'\n' +
'  document.addEventListener(\'keydown\', function(e) {\n' +
'    if (!keys[e.key]) justPressed[e.key] = true;\n' +
'    keys[e.key] = true;\n' +
'    for (var i = 0; i < callbacks.keydown.length; i++) callbacks.keydown[i](e.key);\n' +
'    e.preventDefault();\n' +
'  });\n' +
'  document.addEventListener(\'keyup\', function(e) {\n' +
'    keys[e.key] = false;\n' +
'    justReleased[e.key] = true;\n' +
'    for (var i = 0; i < callbacks.keyup.length; i++) callbacks.keyup[i](e.key);\n' +
'  });\n' +
'\n' +
'  var canvas = document.getElementById(\'c\') || document.querySelector(\'canvas\') || document.body;\n' +
'  canvas.addEventListener(\'mousemove\', function(e) {\n' +
'    var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });\n' +
'    mouseState.x = e.clientX - rect.left;\n' +
'    mouseState.y = e.clientY - rect.top;\n' +
'    for (var i = 0; i < callbacks.mousemove.length; i++) callbacks.mousemove[i](mouseState.x, mouseState.y);\n' +
'  });\n' +
'  canvas.addEventListener(\'mousedown\', function(e) {\n' +
'    mouseState.down = true;\n' +
'    mouseState.justClicked = true;\n' +
'    for (var i = 0; i < callbacks.mouseclick.length; i++) callbacks.mouseclick[i](mouseState.x, mouseState.y);\n' +
'  });\n' +
'  canvas.addEventListener(\'mouseup\', function(e) { mouseState.down = false; });\n' +
'\n' +
'  canvas.addEventListener(\'touchstart\', function(e) {\n' +
'    e.preventDefault();\n' +
'    touchState.active = true;\n' +
'    touchState.count = e.touches.length;\n' +
'    if (e.touches.length > 0) {\n' +
'      var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });\n' +
'      touchState.x = e.touches[0].clientX - rect.left;\n' +
'      touchState.y = e.touches[0].clientY - rect.top;\n' +
'    }\n' +
'    for (var i = 0; i < callbacks.touchstart.length; i++) callbacks.touchstart[i](touchState.x, touchState.y);\n' +
'  }, { passive: false });\n' +
'  canvas.addEventListener(\'touchmove\', function(e) {\n' +
'    e.preventDefault();\n' +
'    touchState.count = e.touches.length;\n' +
'    if (e.touches.length > 0) {\n' +
'      var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });\n' +
'      touchState.x = e.touches[0].clientX - rect.left;\n' +
'      touchState.y = e.touches[0].clientY - rect.top;\n' +
'    }\n' +
'    for (var i = 0; i < callbacks.touchmove.length; i++) callbacks.touchmove[i](touchState.x, touchState.y);\n' +
'  }, { passive: false });\n' +
'  canvas.addEventListener(\'touchend\', function(e) {\n' +
'    touchState.count = e.touches.length;\n' +
'    if (e.touches.length === 0) touchState.active = false;\n' +
'    for (var i = 0; i < callbacks.touchend.length; i++) callbacks.touchend[i]();\n' +
'  });\n' +
'\n' +
'  window.addEventListener(\'gamepadconnected\', function() { gamepadState.connected = true; });\n' +
'  window.addEventListener(\'gamepaddisconnected\', function() { gamepadState.connected = false; });\n' +
'\n' +
'  return {\n' +
'    keyIsDown: function(k) { return !!keys[k]; },\n' +
'    keyJustPressed: function(k) { return !!justPressed[k]; },\n' +
'    keyJustReleased: function(k) { return !!justReleased[k]; },\n' +
'    onKeyDown: function(cb) { callbacks.keydown.push(cb); },\n' +
'    onKeyUp: function(cb) { callbacks.keyup.push(cb); },\n' +
'    mouseX: function() { return mouseState.x; },\n' +
'    mouseY: function() { return mouseState.y; },\n' +
'    mouseIsDown: function() { return mouseState.down; },\n' +
'    mouseJustClicked: function() { return mouseState.justClicked; },\n' +
'    onMouseMove: function(cb) { callbacks.mousemove.push(cb); },\n' +
'    onMouseClick: function(cb) { callbacks.mouseclick.push(cb); },\n' +
'    touchX: function() { return touchState.x; },\n' +
'    touchY: function() { return touchState.y; },\n' +
'    touchIsActive: function() { return touchState.active; },\n' +
'    touchCount: function() { return touchState.count; },\n' +
'    onTouchStart: function(cb) { callbacks.touchstart.push(cb); },\n' +
'    onTouchMove: function(cb) { callbacks.touchmove.push(cb); },\n' +
'    onTouchEnd: function(cb) { callbacks.touchend.push(cb); },\n' +
'    gamepadConnected: function() {\n' +
'      gamepadState.connected = false;\n' +
'      var gps = navigator.getGamepads ? navigator.getGamepads() : [];\n' +
'      for (var i = 0; i < gps.length; i++) { if (gps[i]) { gamepadState.connected = true; break; } }\n' +
'      return gamepadState.connected;\n' +
'    },\n' +
'    gamepadAxis: function(idx) {\n' +
'      var gps = navigator.getGamepads ? navigator.getGamepads() : [];\n' +
'      for (var i = 0; i < gps.length; i++) {\n' +
'        if (gps[i] && gps[i].axes[idx] !== undefined) return gps[i].axes[idx];\n' +
'      }\n' +
'      return 0;\n' +
'    },\n' +
'    gamepadButton: function(idx) {\n' +
'      var gps = navigator.getGamepads ? navigator.getGamepads() : [];\n' +
'      for (var i = 0; i < gps.length; i++) {\n' +
'        if (gps[i] && gps[i].buttons[idx]) return gps[i].buttons[idx].pressed;\n' +
'      }\n' +
'      return false;\n' +
'    },\n' +
'    resetFrame: function() {\n' +
'      justPressed = {};\n' +
'      justReleased = {};\n' +
'      mouseState.justClicked = false;\n' +
'    }\n' +
'  };\n' +
'})();\n';

var AUDIO_RUNTIME = '\n' +
'var __audio = (function() {\n' +
'  var ctx = null;\n' +
'  var masterGain = null;\n' +
'  var musicEl = null;\n' +
'  var muted = false;\n' +
'\n' +
'  function ensureCtx() {\n' +
'    if (!ctx) {\n' +
'      ctx = new (window.AudioContext || window.webkitAudioContext)();\n' +
'      masterGain = ctx.createGain();\n' +
'      masterGain.connect(ctx.destination);\n' +
'    }\n' +
'    if (ctx.state === \'suspended\') ctx.resume();\n' +
'    return ctx;\n' +
'  }\n' +
'\n' +
'  function beep(freq, dur, vol) {\n' +
'    var c = ensureCtx();\n' +
'    var osc = c.createOscillator();\n' +
'    var gain = c.createGain();\n' +
'    osc.frequency.value = freq;\n' +
'    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);\n' +
'    osc.connect(gain);\n' +
'    gain.connect(masterGain);\n' +
'    osc.start(c.currentTime);\n' +
'    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.1));\n' +
'    osc.stop(c.currentTime + (dur || 0.1) + 0.05);\n' +
'  }\n' +
'\n' +
'  function noise(dur, vol) {\n' +
'    var c = ensureCtx();\n' +
'    var bufSize = c.sampleRate * (dur || 0.1);\n' +
'    var buf = c.createBuffer(1, bufSize, c.sampleRate);\n' +
'    var data = buf.getChannelData(0);\n' +
'    for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;\n' +
'    var src = c.createBufferSource();\n' +
'    src.buffer = buf;\n' +
'    var gain = c.createGain();\n' +
'    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);\n' +
'    src.connect(gain);\n' +
'    gain.connect(masterGain);\n' +
'    src.start();\n' +
'    src.stop(c.currentTime + (dur || 0.1));\n' +
'  }\n' +
'\n' +
'  function sweep(f1, f2, dur, vol) {\n' +
'    var c = ensureCtx();\n' +
'    var osc = c.createOscillator();\n' +
'    var gain = c.createGain();\n' +
'    osc.frequency.value = f1;\n' +
'    osc.frequency.linearRampToValueAtTime(f2, c.currentTime + (dur || 0.3));\n' +
'    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);\n' +
'    osc.connect(gain);\n' +
'    gain.connect(masterGain);\n' +
'    osc.start();\n' +
'    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.3));\n' +
'    osc.stop(c.currentTime + (dur || 0.3) + 0.05);\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    init: function() { ensureCtx(); },\n' +
'    beep: beep,\n' +
'    noise: noise,\n' +
'    sweep: sweep,\n' +
'    sfxCoin: function() { beep(880, 0.08, 0.3); setTimeout(function() { beep(1108, 0.12, 0.3); }, 80); },\n' +
'    sfxHit: function() { beep(200, 0.15, 0.5); noise(0.05, 0.3); },\n' +
'    sfxPowerup: function() { beep(440, 0.08, 0.3); setTimeout(function() { beep(554, 0.08, 0.3); }, 80); setTimeout(function() { beep(659, 0.12, 0.3); }, 160); },\n' +
'    sfxLevelup: function() { beep(523, 0.1, 0.3); setTimeout(function() { beep(659, 0.1, 0.3); }, 100); setTimeout(function() { beep(784, 0.1, 0.3); }, 200); setTimeout(function() { beep(1047, 0.2, 0.4); }, 300); },\n' +
'    sfxGameover: function() { beep(440, 0.2, 0.4); setTimeout(function() { beep(370, 0.2, 0.4); }, 200); setTimeout(function() { beep(311, 0.3, 0.3); }, 400); },\n' +
'    sfxCombo: function(mult) { var f = 600 + (mult * 50); beep(f, 0.06, 0.3); setTimeout(function() { beep(f * 1.25, 0.08, 0.3); }, 60); },\n' +
'    sfxFizz: function() {\n' +
'      var c = ensureCtx();\n' +
'      var bufSize = c.sampleRate * 0.4;\n' +
'      var buf = c.createBuffer(1, bufSize, c.sampleRate);\n' +
'      var data = buf.getChannelData(0);\n' +
'      for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;\n' +
'      var src = c.createBufferSource();\n' +
'      src.buffer = buf;\n' +
'      var filter = c.createBiquadFilter();\n' +
'      filter.type = \'highpass\';\n' +
'      filter.frequency.value = 3000;\n' +
'      var gain = c.createGain();\n' +
'      gain.gain.value = 0.3 * (muted ? 0 : 1);\n' +
'      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);\n' +
'      src.connect(filter);\n' +
'      filter.connect(gain);\n' +
'      gain.connect(masterGain);\n' +
'      src.start();\n' +
'      src.stop(c.currentTime + 0.4);\n' +
'    },\n' +
'    musicPlay: function(url) {\n' +
'      if (musicEl) { musicEl.pause(); musicEl = null; }\n' +
'      musicEl = new Audio(url);\n' +
'      musicEl.loop = true;\n' +
'      musicEl.volume = muted ? 0 : 0.5;\n' +
'      musicEl.play().catch(function() {});\n' +
'    },\n' +
'    musicStop: function() { if (musicEl) { musicEl.pause(); musicEl.currentTime = 0; } },\n' +
'    musicVolume: function(v) { if (musicEl) musicEl.volume = muted ? 0 : v; },\n' +
'    masterVolume: function(v) { if (masterGain) masterGain.gain.value = v; },\n' +
'    mute: function() { muted = true; if (masterGain) masterGain.gain.value = 0; if (musicEl) musicEl.volume = 0; },\n' +
'    unmute: function() { muted = false; if (masterGain) masterGain.gain.value = 1; if (musicEl) musicEl.volume = 0.5; },\n' +
'  };\n' +
'})();\n';

var SPRITE_RUNTIME = '\n' +
'var __entity = (function() {\n' +
'  var sprites = {};\n' +
'  var pools = {};\n' +
'\n' +
'  function getSprite(id) {\n' +
'    if (!sprites[id]) throw new Error(\'Sprite not found: \' + id);\n' +
'    return sprites[id];\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    create: function(id, x, y, w, h) {\n' +
'      sprites[id] = { x: x, y: y, w: w, h: h, color: \'#fff\', visible: true,\n' +
'        image: null, sheet: null, frame: 0, rotation: 0, scaleX: 1, scaleY: 1,\n' +
'        opacity: 1, groups: [] };\n' +
'    },\n' +
'    setPos: function(id, x, y) { var s = getSprite(id); s.x = x; s.y = y; },\n' +
'    setSize: function(id, w, h) { var s = getSprite(id); s.w = w; s.h = h; },\n' +
'    setColor: function(id, c) { getSprite(id).color = c; },\n' +
'    setVisible: function(id, v) { getSprite(id).visible = v; },\n' +
'    getX: function(id) { return getSprite(id).x; },\n' +
'    getY: function(id) { return getSprite(id).y; },\n' +
'    getW: function(id) { return getSprite(id).w; },\n' +
'    getH: function(id) { return getSprite(id).h; },\n' +
'    destroy: function(id) { delete sprites[id]; },\n' +
'    loadImage: function(id, url) {\n' +
'      var s = getSprite(id);\n' +
'      var img = new Image();\n' +
'      img.src = url;\n' +
'      s.image = img;\n' +
'    },\n' +
'    setSheet: function(id, fw, fh, cols) {\n' +
'      getSprite(id).sheet = { fw: fw, fh: fh, cols: cols };\n' +
'    },\n' +
'    setFrame: function(id, f) { getSprite(id).frame = f; },\n' +
'    setRotation: function(id, a) { getSprite(id).rotation = a; },\n' +
'    setScale: function(id, sx, sy) { var s = getSprite(id); s.scaleX = sx; s.scaleY = sy; },\n' +
'    setOpacity: function(id, a) { getSprite(id).opacity = a; },\n' +
'    draw: function(id) {\n' +
'      var s = getSprite(id);\n' +
'      if (!s.visible) return;\n' +
'      __ctx.save();\n' +
'      __ctx.globalAlpha = s.opacity;\n' +
'      __ctx.translate(s.x + s.w / 2, s.y + s.h / 2);\n' +
'      __ctx.rotate(s.rotation);\n' +
'      __ctx.scale(s.scaleX, s.scaleY);\n' +
'      if (s.image && s.image.complete) {\n' +
'        if (s.sheet) {\n' +
'          var col = s.frame % s.sheet.cols;\n' +
'          var row = Math.floor(s.frame / s.sheet.cols);\n' +
'          __ctx.drawImage(s.image, col * s.sheet.fw, row * s.sheet.fh,\n' +
'            s.sheet.fw, s.sheet.fh, -s.w / 2, -s.h / 2, s.w, s.h);\n' +
'        } else {\n' +
'          __ctx.drawImage(s.image, -s.w / 2, -s.h / 2, s.w, s.h);\n' +
'        }\n' +
'      } else {\n' +
'        __ctx.fillStyle = s.color;\n' +
'        __ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);\n' +
'      }\n' +
'      __ctx.restore();\n' +
'    },\n' +
'    drawAll: function() {\n' +
'      var ids = Object.keys(sprites);\n' +
'      for (var i = 0; i < ids.length; i++) {\n' +
'        var s = sprites[ids[i]];\n' +
'        if (s.visible) __entity.draw(ids[i]);\n' +
'      }\n' +
'    },\n' +
'    collidesRect: function(a, b) {\n' +
'      var sa = getSprite(a), sb = getSprite(b);\n' +
'      return sa.x < sb.x + sb.w && sa.x + sa.w > sb.x &&\n' +
'             sa.y < sb.y + sb.h && sa.y + sa.h > sb.y;\n' +
'    },\n' +
'    collidesPoint: function(id, px, py) {\n' +
'      var s = getSprite(id);\n' +
'      return px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h;\n' +
'    },\n' +
'    collidesCircle: function(a, b) {\n' +
'      var sa = getSprite(a), sb = getSprite(b);\n' +
'      var ax = sa.x + sa.w / 2, ay = sa.y + sa.h / 2, ar = sa.w / 2;\n' +
'      var bx = sb.x + sb.w / 2, by = sb.y + sb.h / 2, br = sb.w / 2;\n' +
'      var dx = ax - bx, dy = ay - by;\n' +
'      return Math.sqrt(dx * dx + dy * dy) < ar + br;\n' +
'    },\n' +
'    collisionGroup: function(id, group) {\n' +
'      var s = getSprite(id);\n' +
'      if (s.groups.indexOf(group) === -1) s.groups.push(group);\n' +
'    },\n' +
'    checkGroupCollisions: function(ga, gb, cb) {\n' +
'      var idsA = [], idsB = [];\n' +
'      var ids = Object.keys(sprites);\n' +
'      for (var i = 0; i < ids.length; i++) {\n' +
'        if (sprites[ids[i]].groups.indexOf(ga) !== -1) idsA.push(ids[i]);\n' +
'        if (sprites[ids[i]].groups.indexOf(gb) !== -1) idsB.push(ids[i]);\n' +
'      }\n' +
'      for (var a = 0; a < idsA.length; a++) {\n' +
'        for (var b = 0; b < idsB.length; b++) {\n' +
'          if (idsA[a] !== idsB[b] && __entity.collidesRect(idsA[a], idsB[b])) {\n' +
'            cb(idsA[a], idsB[b]);\n' +
'          }\n' +
'        }\n' +
'      }\n' +
'    },\n' +
'    poolCreate: function(name, max) {\n' +
'      var entities = [];\n' +
'      var free = [];\n' +
'      for (var i = 0; i < max; i++) {\n' +
'        var id = name + \'_\' + i;\n' +
'        sprites[id] = { x: 0, y: 0, w: 0, h: 0, color: \'#fff\', visible: false,\n' +
'          image: null, sheet: null, frame: 0, rotation: 0, scaleX: 1, scaleY: 1,\n' +
'          opacity: 1, groups: [] };\n' +
'        entities.push(id);\n' +
'        free.push(id);\n' +
'      }\n' +
'      pools[name] = { entities: entities, free: free, active: [] };\n' +
'    },\n' +
'    poolSpawn: function(name) {\n' +
'      var p = pools[name];\n' +
'      if (!p || p.free.length === 0) return null;\n' +
'      var id = p.free.pop();\n' +
'      p.active.push(id);\n' +
'      sprites[id].visible = true;\n' +
'      return id;\n' +
'    },\n' +
'    poolRecycle: function(name, id) {\n' +
'      var p = pools[name];\n' +
'      if (!p) return;\n' +
'      var idx = p.active.indexOf(id);\n' +
'      if (idx !== -1) {\n' +
'        p.active.splice(idx, 1);\n' +
'        p.free.push(id);\n' +
'        sprites[id].visible = false;\n' +
'      }\n' +
'    },\n' +
'    poolForEach: function(name, cb) {\n' +
'      var p = pools[name];\n' +
'      if (!p) return;\n' +
'      for (var i = 0; i < p.active.length; i++) {\n' +
'        cb(p.active[i]);\n' +
'      }\n' +
'    },\n' +
'  };\n' +
'})();\n';

var SCENE_RUNTIME = '\n' +
'var __timer = (function() {\n' +
'  var timers = {};\n' +
'  return {\n' +
'    set: function(id, dur, cb) { timers[id] = { remaining: dur, cb: cb, repeat: false, interval: dur }; },\n' +
'    repeat: function(id, interval, cb) { timers[id] = { remaining: interval, cb: cb, repeat: true, interval: interval }; },\n' +
'    cancel: function(id) { delete timers[id]; },\n' +
'    step: function(dt) {\n' +
'      var ids = Object.keys(timers);\n' +
'      for (var i = 0; i < ids.length; i++) {\n' +
'        var t = timers[ids[i]];\n' +
'        t.remaining -= dt;\n' +
'        if (t.remaining <= 0) {\n' +
'          t.cb();\n' +
'          if (t.repeat) { t.remaining += t.interval; }\n' +
'          else { delete timers[ids[i]]; }\n' +
'        }\n' +
'      }\n' +
'    },\n' +
'  };\n' +
'})();\n' +
'\n' +
'var __tween = (function() {\n' +
'  var tweens = [];\n' +
'  var easings = {\n' +
'    linear: function(t) { return t; },\n' +
'    ease_in: function(t) { return t * t; },\n' +
'    ease_out: function(t) { return t * (2 - t); },\n' +
'    ease_in_out: function(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },\n' +
'    bounce: function(t) { if (t < 1/2.75) return 7.5625*t*t; if (t < 2/2.75) return 7.5625*(t-=1.5/2.75)*t+0.75; if (t < 2.5/2.75) return 7.5625*(t-=2.25/2.75)*t+0.9375; return 7.5625*(t-=2.625/2.75)*t+0.984375; },\n' +
'    elastic: function(t) { return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10*(t-1)) * Math.sin((t-1.1)*5*Math.PI); },\n' +
'  };\n' +
'  return {\n' +
'    add: function(targetId, prop, from, to, dur, easing) {\n' +
'      tweens.push({ targetId: targetId, prop: prop, from: from, to: to, dur: dur, elapsed: 0, easing: easings[easing] || easings.linear });\n' +
'    },\n' +
'    step: function(dt) {\n' +
'      for (var i = tweens.length - 1; i >= 0; i--) {\n' +
'        var tw = tweens[i];\n' +
'        tw.elapsed += dt;\n' +
'        var t = Math.min(tw.elapsed / tw.dur, 1);\n' +
'        var val = tw.from + (tw.to - tw.from) * tw.easing(t);\n' +
'        if (typeof __entity !== \'undefined\') {\n' +
'          var s = __entity;\n' +
'          if (tw.prop === \'x\') s.setPos(tw.targetId, val, s.getY(tw.targetId));\n' +
'          else if (tw.prop === \'y\') s.setPos(tw.targetId, s.getX(tw.targetId), val);\n' +
'          else if (tw.prop === \'opacity\') s.setOpacity(tw.targetId, val);\n' +
'          else if (tw.prop === \'rotation\') s.setRotation(tw.targetId, val);\n' +
'        }\n' +
'        if (t >= 1) tweens.splice(i, 1);\n' +
'      }\n' +
'    },\n' +
'  };\n' +
'})();\n' +
'\n' +
'var __scene = (function() {\n' +
'  var scenes = {};\n' +
'  var stack = [];\n' +
'  return {\n' +
'    register: function(name, initFn, updateFn, renderFn) {\n' +
'      scenes[name] = { init: initFn, update: updateFn, render: renderFn };\n' +
'    },\n' +
'    switchTo: function(name) {\n' +
'      stack = [name];\n' +
'      if (scenes[name] && scenes[name].init) scenes[name].init();\n' +
'    },\n' +
'    current: function() { return stack.length > 0 ? stack[stack.length - 1] : \'\'; },\n' +
'    push: function(name) {\n' +
'      stack.push(name);\n' +
'      if (scenes[name] && scenes[name].init) scenes[name].init();\n' +
'    },\n' +
'    pop: function() {\n' +
'      if (stack.length > 1) stack.pop();\n' +
'      return __scene.current();\n' +
'    },\n' +
'    getUpdate: function() { var s = scenes[__scene.current()]; return s ? s.update : null; },\n' +
'    getRender: function() { var s = scenes[__scene.current()]; return s ? s.render : null; },\n' +
'  };\n' +
'})();\n' +
'\n' +
'var __game = (function() {\n' +
'  var startTime = 0;\n' +
'  var lastTime = 0;\n' +
'  var dt = 0;\n' +
'  var frames = 0;\n' +
'  var fps = 0;\n' +
'  var fpsAccum = 0;\n' +
'  var fpsFrames = 0;\n' +
'  var paused = false;\n' +
'  var cameraX = 0, cameraY = 0;\n' +
'  var shakeIntensity = 0, shakeDuration = 0, shakeElapsed = 0;\n' +
'  var zoomLevel = 1;\n' +
'  var initFn = null;\n' +
'\n' +
'  function loop(timestamp) {\n' +
'    if (!startTime) { startTime = timestamp; lastTime = timestamp; }\n' +
'    var rawDt = (timestamp - lastTime) / 1000;\n' +
'    dt = Math.min(rawDt, 0.1);\n' +
'    lastTime = timestamp;\n' +
'\n' +
'    fpsAccum += rawDt;\n' +
'    fpsFrames++;\n' +
'    if (fpsAccum >= 1) { fps = fpsFrames; fpsFrames = 0; fpsAccum = 0; }\n' +
'\n' +
'    if (!paused) {\n' +
'      if (typeof __input !== \'undefined\' && __input.gamepadConnected) __input.gamepadConnected();\n' +
'      __timer.step(dt);\n' +
'      __tween.step(dt);\n' +
'      var updateFn = __scene.getUpdate();\n' +
'      if (updateFn) updateFn(dt);\n' +
'      __ctx.save();\n' +
'      var ox = cameraX, oy = cameraY;\n' +
'      if (shakeIntensity > 0) {\n' +
'        shakeElapsed += dt;\n' +
'        var factor = 1 - (shakeElapsed / shakeDuration);\n' +
'        if (factor <= 0) { shakeIntensity = 0; }\n' +
'        else { ox += (Math.random() - 0.5) * shakeIntensity * factor * 2; oy += (Math.random() - 0.5) * shakeIntensity * factor * 2; }\n' +
'      }\n' +
'      __ctx.translate(ox, oy);\n' +
'      __ctx.scale(zoomLevel, zoomLevel);\n' +
'      var renderFn = __scene.getRender();\n' +
'      if (renderFn) renderFn();\n' +
'      __ctx.restore();\n' +
'      if (typeof __input !== \'undefined\' && __input.resetFrame) __input.resetFrame();\n' +
'      frames++;\n' +
'    }\n' +
'    requestAnimationFrame(loop);\n' +
'  }\n' +
'\n' +
'  return {\n' +
'    init: function(w, h, fn) {\n' +
'      __canvas.width = w;\n' +
'      __canvas.height = h;\n' +
'      initFn = fn;\n' +
'      if (fn) fn();\n' +
'    },\n' +
'    run: function() { requestAnimationFrame(loop); },\n' +
'    pause: function() { paused = true; },\n' +
'    resume: function() { paused = false; },\n' +
'    fps: function() { return fps; },\n' +
'    deltaTime: function() { return dt; },\n' +
'    elapsedTime: function() { return (lastTime - startTime) / 1000; },\n' +
'    frameCount: function() { return frames; },\n' +
'    cameraSet: function(x, y) { cameraX = x; cameraY = y; },\n' +
'    cameraShake: function(intensity, duration) { shakeIntensity = intensity; shakeDuration = duration; shakeElapsed = 0; },\n' +
'    cameraZoom: function(level) { zoomLevel = level; },\n' +
'  };\n' +
'})();\n';

var NET_RUNTIME = '\n' +
'var __net = (function() {\n' +
'  var ws = null;\n' +
'  var playerId = \'\';\n' +
'  var handlers = {};\n' +
'  var connected = false;\n' +
'  var latency = 0;\n' +
'  var pingInterval = null;\n' +
'  var lastPingTime = 0;\n' +
'  var disconnectCallbacks = [];\n' +
'  var reconnectUrl = \'\';\n' +
'  var reconnectAttempts = 0;\n' +
'  var maxReconnectAttempts = 15;\n' +
'  var playerSnapshots = {};\n' +
'  var INTERP_DELAY = 100;\n' +
'\n' +
'  function send(type, data) {\n' +
'    if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: type, data: data }));\n' +
'  }\n' +
'\n' +
'  function handleMessage(msg) {\n' +
'    var parsed = JSON.parse(msg.data);\n' +
'    if (parsed.type === \'__pong\') {\n' +
'      latency = Date.now() - lastPingTime;\n' +
'      return;\n' +
'    }\n' +
'    if (parsed.type === \'__assign_id\') {\n' +
'      playerId = parsed.data.id;\n' +
'      return;\n' +
'    }\n' +
'    if (parsed.type === \'__player_update\') {\n' +
'      var pid = parsed.data.player_id;\n' +
'      if (!playerSnapshots[pid]) playerSnapshots[pid] = [];\n' +
'      parsed.data.timestamp = Date.now();\n' +
'      playerSnapshots[pid].push(parsed.data);\n' +
'      if (playerSnapshots[pid].length > 10) playerSnapshots[pid].shift();\n' +
'    }\n' +
'    var cbs = handlers[parsed.type];\n' +
'    if (cbs) { for (var i = 0; i < cbs.length; i++) cbs[i](parsed.data); }\n' +
'  }\n' +
'\n' +
'  function tryReconnect() {\n' +
'    if (reconnectAttempts >= maxReconnectAttempts) return;\n' +
'    reconnectAttempts++;\n' +
'    setTimeout(function() {\n' +
'      if (!connected && reconnectUrl) __net.connect(reconnectUrl);\n' +
'    }, 2000);\n' +
'  }\n' +
'\n' +
'  var __net = {\n' +
'    connect: function(url) {\n' +
'      reconnectUrl = url;\n' +
'      ws = new WebSocket(url);\n' +
'      ws.onopen = function() { connected = true; reconnectAttempts = 0;\n' +
'        pingInterval = setInterval(function() { lastPingTime = Date.now(); send(\'__ping\', {}); }, 5000);\n' +
'      };\n' +
'      ws.onmessage = handleMessage;\n' +
'      ws.onclose = function() {\n' +
'        connected = false;\n' +
'        if (pingInterval) clearInterval(pingInterval);\n' +
'        for (var i = 0; i < disconnectCallbacks.length; i++) disconnectCallbacks[i]();\n' +
'        tryReconnect();\n' +
'      };\n' +
'      ws.onerror = function() {};\n' +
'    },\n' +
'    disconnect: function() { reconnectUrl = \'\'; if (ws) ws.close(); },\n' +
'    send: send,\n' +
'    on: function(type, cb) { if (!handlers[type]) handlers[type] = []; handlers[type].push(cb); },\n' +
'    onDisconnect: function(cb) { disconnectCallbacks.push(cb); },\n' +
'    isConnected: function() { return connected; },\n' +
'    latency: function() { return latency; },\n' +
'    playerId: function() { return playerId; },\n' +
'    roomCreate: function(mode, max) { send(\'room_create\', { mode: mode, max_players: max }); },\n' +
'    roomJoin: function(id) { send(\'room_join\', { room_id: id }); },\n' +
'    roomJoinRandom: function(mode) { send(\'room_join_random\', { mode: mode }); },\n' +
'    roomLeave: function() { send(\'room_leave\', {}); },\n' +
'    roomPlayers: function() { return 0; },\n' +
'    roomOnPlayerJoin: function(cb) { __net.on(\'player_joined\', cb); },\n' +
'    roomOnPlayerLeave: function(cb) { __net.on(\'player_left\', cb); },\n' +
'    roomSpectate: function(id) { send(\'room_spectate\', { room_id: id }); },\n' +
'    roomSpectatorCount: function() { return 0; },\n' +
'    syncPos: function(x, y) { send(\'sync_pos\', { x: x, y: y }); },\n' +
'    syncState: function(key, val) { send(\'sync_state\', { key: key, value: val }); },\n' +
'    onPlayerUpdate: function(cb) { __net.on(\'__player_update\', cb); },\n' +
'    interpolate: function(pid, prop) {\n' +
'      var snaps = playerSnapshots[pid];\n' +
'      if (!snaps || snaps.length < 2) return snaps && snaps.length === 1 ? (snaps[0][prop] || 0) : 0;\n' +
'      var now = Date.now() - INTERP_DELAY;\n' +
'      var a = snaps[snaps.length - 2], b = snaps[snaps.length - 1];\n' +
'      var range = b.timestamp - a.timestamp;\n' +
'      if (range <= 0) return b[prop] || 0;\n' +
'      var t = Math.max(0, Math.min(1, (now - a.timestamp) / range));\n' +
'      return (a[prop] || 0) + ((b[prop] || 0) - (a[prop] || 0)) * t;\n' +
'    },\n' +
'    leaderboardSubmit: function(score) { send(\'leaderboard_submit\', { score: score }); },\n' +
'    leaderboardGet: function(scope, count, cb) { send(\'leaderboard_get\', { scope: scope, count: count }); __net.on(\'leaderboard_data\', cb); },\n' +
'    leaderboardRank: function() { return 0; },\n' +
'  };\n' +
'  return __net;\n' +
'})();\n';

function getEditorValue() {
  return document.getElementById('editor').value;
}

function setEditorValue(code) {
  document.getElementById('editor').value = code;
}

function compile(source) {
  try {
    var lexer = new CBang.Lexer(source, 'playground.cb');
    var tokens = lexer.tokenize();

    var lexErrors = tokens.filter(function (t) {
      return t.type === 'Error';
    });
    if (lexErrors.length > 0) {
      return { error: lexErrors.map(function (e) { return 'Lex error: ' + e.value; }).join('\n') };
    }

    var parser = new CBang.Parser(tokens);
    var result = parser.parse();

    if (result.diagnostics.length > 0) {
      return {
        error: result.diagnostics.map(function (d) {
          return CBang.formatDiagnostic(d, source, { noColor: true });
        }).join('\n\n'),
      };
    }

    var gen = new CBang.JsGenerator();
    var js = gen.generate(result.program);
    return { js: js };
  } catch (e) {
    return { error: e.message };
  }
}

function run() {
  var source = getEditorValue();
  var result = compile(source);

  var jsOutput = document.getElementById('js-output');
  var consoleOutput = document.getElementById('console-output');

  if (result.error) {
    jsOutput.textContent = '';
    consoleOutput.textContent = result.error;
    consoleOutput.className = 'pg-output error';
    return;
  }

  jsOutput.textContent = result.js;
  consoleOutput.className = 'pg-output';
  consoleOutput.textContent = 'Running...';

  // Show running indicator on the Run button
  var runBtn = document.getElementById('run-btn');
  runBtn.disabled = true;
  runBtn.textContent = 'Running...';

  function resetRunBtn() {
    runBtn.disabled = false;
    runBtn.textContent = '';
    var icon = document.createElement('span');
    icon.className = 'play-icon';
    icon.textContent = '\u25B6';
    runBtn.appendChild(icon);
    runBtn.appendChild(document.createTextNode(' Run'));
  }

  var execCode = result.js;
  // Auto-call main() if defined
  if (execCode.indexOf('function main(') !== -1) {
    execCode += '\nmain();';
  }

  // Detect if code uses canvas functions, animation, or game engine features
  var usesCanvas = execCode.indexOf('__canvas') !== -1 || execCode.indexOf('__ctx') !== -1 || execCode.indexOf('__entity.') !== -1;
  var isAnimated = execCode.indexOf('__animLoop') !== -1 || execCode.indexOf('__game.run') !== -1;

  // Build runtime injection code based on what the generated code uses
  var runtimeCode = '';
  if (execCode.indexOf('__input.') !== -1) runtimeCode += INPUT_RUNTIME;
  if (execCode.indexOf('__audio.') !== -1) runtimeCode += AUDIO_RUNTIME;
  if (execCode.indexOf('__entity.') !== -1) runtimeCode += SPRITE_RUNTIME;
  if (execCode.indexOf('__scene.') !== -1 || execCode.indexOf('__game.') !== -1 || execCode.indexOf('__timer.') !== -1 || execCode.indexOf('__tween.') !== -1) runtimeCode += SCENE_RUNTIME;
  if (execCode.indexOf('__net.') !== -1) runtimeCode += NET_RUNTIME;

  // Execute in a sandboxed iframe via Blob URL to avoid needing unsafe-eval.
  // The iframe posts console output back to us via postMessage.
  // For animated content, logs are sent before the animation loop starts,
  // and the iframe stays alive to keep rendering.
  var iframeHtml = '<!DOCTYPE html><html><head></head>' +
    '<body style="margin:0;padding:0;background:transparent;overflow:hidden;"><script>' +
    'var __canvas = document.createElement("canvas"); __canvas.id = "c"; __canvas.width = 400; __canvas.height = 400;' +
    '__canvas.style.display = "block"; __canvas.style.margin = "0 auto";' +
    'document.body.appendChild(__canvas);' +
    'var __ctx = __canvas.getContext("2d");' +
    'var __logs = [];' +
    'console.log = function() { __logs.push(Array.prototype.slice.call(arguments).join(" ")); };' +
    'console.warn = function() { __logs.push("[warn] " + Array.prototype.slice.call(arguments).join(" ")); };' +
    'console.error = function() { __logs.push("[error] " + Array.prototype.slice.call(arguments).join(" ")); };' +
    'try {' + runtimeCode.replace(/<\/script>/gi, '<\\/script>') + execCode.replace(/<\/script>/gi, '<\\/script>') + ';' +
    '  var __canvasData = null; try { __canvasData = __canvas.toDataURL("image/png"); } catch(ce) {}' +
    '  parent.postMessage({ type: "cbang-output", logs: __logs, canvasData: __canvasData }, "*");' +
    '} catch(e) {' +
    '  var __canvasData2 = null; try { __canvasData2 = __canvas.toDataURL("image/png"); } catch(ce) {}' +
    '  parent.postMessage({ type: "cbang-output", logs: __logs, error: e.message, canvasData: __canvasData2 }, "*");' +
    '}' +
    '<\/script></body></html>';

  var blob = new Blob([iframeHtml], { type: 'text/html' });
  var url = URL.createObjectURL(blob);

  // Remove any previous sandbox iframe
  var oldFrame = document.getElementById('cbang-sandbox');
  if (oldFrame) oldFrame.remove();
  // Also clear any previous live canvas iframe
  var oldLive = document.getElementById('cbang-live-canvas');
  if (oldLive) oldLive.remove();

  var iframe = document.createElement('iframe');
  iframe.id = isAnimated ? 'cbang-live-canvas' : 'cbang-sandbox';
  iframe.sandbox = 'allow-scripts';
  iframe.src = url;

  if (isAnimated && usesCanvas) {
    // Show the iframe live inside the canvas panel
    iframe.style.width = '400px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    var canvasPanel = document.getElementById('canvas-panel');
    var canvasContainer = canvasPanel.querySelector('.pg-canvas-container');
    var canvasImg = document.getElementById('canvas-img');
    canvasImg.style.display = 'none';
    canvasContainer.appendChild(iframe);
    canvasPanel.style.display = 'flex';
  } else {
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  // Listen for result (no timeout for animated/game code — games run indefinitely)
  var timeout = null;
  if (!isAnimated) {
    timeout = setTimeout(function () {
      window.removeEventListener('message', onMessage);
      consoleOutput.textContent = '(timeout — program took too long)';
      consoleOutput.className = 'pg-output error';
      resetRunBtn();
      iframe.remove();
      URL.revokeObjectURL(url);
    }, 15000);
  }

  function onMessage(e) {
    // Only accept messages with our specific type marker. The sandboxed iframe
    // (allow-scripts only, no allow-same-origin) cannot access the parent DOM.
    // The unique message type acts as our validation token.
    if (!e.data || e.data.type !== 'cbang-output') return;

    if (timeout) clearTimeout(timeout);
    window.removeEventListener('message', onMessage);
    var logText = (Array.isArray(e.data.logs) ? e.data.logs : []).join('\n');
    if (e.data.error) {
      consoleOutput.textContent = (logText ? logText + '\n' : '') + 'Runtime error: ' + String(e.data.error);
      consoleOutput.className = 'pg-output error';
    } else {
      consoleOutput.textContent = logText || '(no output)';
      consoleOutput.className = 'pg-output success';
    }

    var canvasPanel = document.getElementById('canvas-panel');
    var canvasImg = document.getElementById('canvas-img');

    if (isAnimated && usesCanvas) {
      // Iframe is already live in the canvas panel — keep it running
      canvasImg.style.display = 'none';
    } else if (usesCanvas) {
      // Static canvas — show captured image
      var canvasData = e.data.canvasData;
      if (typeof canvasData === 'string' && canvasData.indexOf('data:image/') === 0) {
        canvasImg.style.display = '';
        canvasImg.src = canvasData;
        canvasPanel.style.display = 'flex';
      } else {
        canvasPanel.style.display = 'none';
      }
      iframe.remove();
      URL.revokeObjectURL(url);
    } else {
      canvasPanel.style.display = 'none';
      iframe.remove();
      URL.revokeObjectURL(url);
    }

    resetRunBtn();
  }
  window.addEventListener('message', onMessage);
}

function loadExample(name) {
  if (EXAMPLES[name]) {
    setEditorValue(EXAMPLES[name]);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', function () {
  // Set default code
  setEditorValue(EXAMPLES.hello);

  // Run button
  document.getElementById('run-btn').addEventListener('click', run);

  // Examples dropdown
  document.getElementById('examples-select').addEventListener('change', function () {
    if (this.value) {
      loadExample(this.value);
      this.value = '';
    }
  });

  // Ctrl/Cmd+Enter to run
  document.getElementById('editor').addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
    // Tab inserts spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 4;
    }
  });
});
