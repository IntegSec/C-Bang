# Game Development

C! includes a built-in game engine that compiles to HTML5 Canvas + Web Audio, giving you a zero-dependency way to build 2D games that run in any browser. The engine provides input handling, audio synthesis, sprite management, scene orchestration, and real-time networking -- all exposed as compile-time macros that expand to efficient JavaScript.

---

## Overview

The game engine is organized into six subsystems:

| Subsystem | Purpose | Runtime Object |
|-----------|---------|----------------|
| **Canvas** | 2D drawing primitives (rects, circles, text, paths, transforms) | `__canvas` / `__ctx` |
| **Input** | Keyboard, mouse, touch, and gamepad polling + events | `__input` |
| **Audio** | Procedural sound effects and music via Web Audio API | `__audio` |
| **Sprites & Entities** | Sprite lifecycle, rendering, collision detection, object pools | `__entity` |
| **Scene & Game Loop** | Scene management, game loop, camera, timers, tweens | `__scene` / `__game` / `__timer` / `__tween` |
| **Networking** | WebSocket rooms, state sync, interpolation, leaderboards | `__net` |

Every macro compiles away at build time -- there is no runtime library to load.

---

## Quick Start

A minimal game in roughly 20 lines:

```cb
// mini.cb — A bouncing ball

#[intent("Initialize a canvas and bounce a ball")]
fn main() with IO {
    game_init!("Bouncing Ball", 400, 300);

    let mut x: f64 = 200.0;
    let mut y: f64 = 150.0;
    let mut dx: f64 = 120.0;
    let mut dy: f64 = 90.0;

    scene_register!("play", fn() {
        let dt = delta_time!();
        x = x + dx * dt;
        y = y + dy * dt;
        if x < 10.0 || x > 390.0 { dx = -dx; sfx_hit!(); }
        if y < 10.0 || y > 290.0 { dy = -dy; sfx_hit!(); }

        canvas_clear!();
        canvas_fill_style!("#e33");
        canvas_circle!(x, y, 10.0);
    });

    game_run!();
}
```

Compile and open the generated HTML:

```bash
cbang build mini.cb
open mini.html
```

---

## Full Macro Reference

### Canvas (22 macros)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `canvas_size!` | `width, height` | `unit` | Set canvas dimensions in pixels |
| `canvas_clear!` | -- | `unit` | Clear the entire canvas |
| `canvas_fill_style!` | `color: str` | `unit` | Set the fill color (CSS color string) |
| `canvas_stroke_style!` | `color: str` | `unit` | Set the stroke color |
| `canvas_line_width!` | `width: f64` | `unit` | Set the stroke line width |
| `canvas_fill_rect!` | `x, y, w, h` | `unit` | Draw a filled rectangle |
| `canvas_stroke_rect!` | `x, y, w, h` | `unit` | Draw a stroked rectangle |
| `canvas_line!` | `x1, y1, x2, y2` | `unit` | Draw a line between two points |
| `canvas_circle!` | `cx, cy, r` | `unit` | Draw a filled circle |
| `canvas_text!` | `text, x, y` | `unit` | Draw filled text at a position |
| `canvas_font!` | `font: str` | `unit` | Set the font (CSS font string) |
| `canvas_begin_path!` | -- | `unit` | Start a new drawing path |
| `canvas_move_to!` | `x, y` | `unit` | Move the path cursor |
| `canvas_line_to!` | `x, y` | `unit` | Add a line segment to the path |
| `canvas_close_path!` | -- | `unit` | Close the current path |
| `canvas_fill!` | -- | `unit` | Fill the current path |
| `canvas_stroke!` | -- | `unit` | Stroke the current path |
| `canvas_save!` | -- | `unit` | Save the current drawing state |
| `canvas_restore!` | -- | `unit` | Restore a previously saved state |
| `canvas_translate!` | `x, y` | `unit` | Translate the drawing origin |
| `canvas_rotate!` | `angle: f64` | `unit` | Rotate the canvas (radians) |
| `canvas_scale!` | `sx, sy` | `unit` | Scale the canvas |

> `canvas_animate!` is available for raw `requestAnimationFrame` loops but most games should use `scene_register!` + `game_run!` instead.

### Input (22 macros)

#### Keyboard (5)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `key_is_down!` | `key: str` | `bool` | True while a key is held down |
| `key_just_pressed!` | `key: str` | `bool` | True on the frame a key is first pressed |
| `key_just_released!` | `key: str` | `bool` | True on the frame a key is released |
| `on_key_down!` | `callback: fn` | `unit` | Register a key-down event handler |
| `on_key_up!` | `callback: fn` | `unit` | Register a key-up event handler |

#### Mouse (6)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `mouse_x!` | -- | `f64` | Current mouse X position on canvas |
| `mouse_y!` | -- | `f64` | Current mouse Y position on canvas |
| `mouse_is_down!` | -- | `bool` | True while a mouse button is held |
| `mouse_just_clicked!` | -- | `bool` | True on the frame of a mouse click |
| `on_mouse_move!` | `callback: fn` | `unit` | Register a mouse-move handler |
| `on_mouse_click!` | `callback: fn` | `unit` | Register a click handler |

#### Touch (7)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `touch_x!` | -- | `f64` | X position of the primary touch point |
| `touch_y!` | -- | `f64` | Y position of the primary touch point |
| `touch_is_active!` | -- | `bool` | True while a touch is active |
| `touch_count!` | -- | `i32` | Number of active touch points |
| `on_touch_start!` | `callback: fn` | `unit` | Register a touch-start handler |
| `on_touch_move!` | `callback: fn` | `unit` | Register a touch-move handler |
| `on_touch_end!` | `callback: fn` | `unit` | Register a touch-end handler |

#### Gamepad (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `gamepad_connected!` | -- | `bool` | True if a gamepad is connected |
| `gamepad_axis!` | `axis: i32` | `f64` | Value of a gamepad axis (-1.0 to 1.0) |
| `gamepad_button!` | `button: i32` | `bool` | True if a gamepad button is pressed |

> **Keyboard key names** follow the standard `KeyboardEvent.key` values: `"ArrowLeft"`, `"ArrowRight"`, `" "` (space), `"a"` through `"z"`, etc.

### Audio (17 macros)

#### Synthesizer (4)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `audio_init!` | -- | `unit` | Initialize the Web Audio context (call once, e.g. on first user gesture) |
| `audio_beep!` | `freq, duration` | `unit` | Play a sine-wave beep |
| `audio_noise!` | `duration` | `unit` | Play white noise for a duration |
| `audio_sweep!` | `startFreq, endFreq, duration` | `unit` | Play a frequency sweep |

#### Sound Effects (7)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `sfx_coin!` | -- | `unit` | Play a coin-collect sound |
| `sfx_hit!` | -- | `unit` | Play a hit/damage sound |
| `sfx_powerup!` | -- | `unit` | Play a power-up sound |
| `sfx_levelup!` | -- | `unit` | Play a level-up fanfare |
| `sfx_gameover!` | -- | `unit` | Play a game-over sound |
| `sfx_combo!` | `multiplier: i32` | `unit` | Play a combo sound (pitch scales with multiplier) |
| `sfx_fizz!` | -- | `unit` | Play a fizz/sparkle sound |

#### Music (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `music_play!` | `track: str` | `unit` | Start playing a music track |
| `music_stop!` | -- | `unit` | Stop the current music |
| `music_volume!` | `vol: f64` | `unit` | Set music volume (0.0 to 1.0) |

#### Master Controls (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `audio_master_volume!` | `vol: f64` | `unit` | Set the master volume (0.0 to 1.0) |
| `audio_mute!` | -- | `unit` | Mute all audio |
| `audio_unmute!` | -- | `unit` | Unmute all audio |

### Sprites & Entities (27 macros)

#### Lifecycle (10)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `sprite_create!` | `id: str` | `unit` | Create a new sprite entity |
| `sprite_set_pos!` | `id, x, y` | `unit` | Set sprite position |
| `sprite_set_size!` | `id, w, h` | `unit` | Set sprite dimensions |
| `sprite_set_color!` | `id, color: str` | `unit` | Set sprite fill color |
| `sprite_set_visible!` | `id, visible: bool` | `unit` | Show or hide a sprite |
| `sprite_get_x!` | `id: str` | `f64` | Get sprite X position |
| `sprite_get_y!` | `id: str` | `f64` | Get sprite Y position |
| `sprite_get_width!` | `id: str` | `f64` | Get sprite width |
| `sprite_get_height!` | `id: str` | `f64` | Get sprite height |
| `sprite_destroy!` | `id: str` | `unit` | Remove a sprite from the world |

#### Appearance (6)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `sprite_load_image!` | `id, url: str` | `unit` | Load an image for a sprite |
| `sprite_set_sheet!` | `id, url, cols, rows` | `unit` | Assign a spritesheet |
| `sprite_set_frame!` | `id, frame: i32` | `unit` | Set the current spritesheet frame |
| `sprite_set_rotation!` | `id, angle: f64` | `unit` | Set sprite rotation (radians) |
| `sprite_set_scale!` | `id, sx, sy` | `unit` | Set sprite scale |
| `sprite_set_opacity!` | `id, alpha: f64` | `unit` | Set sprite opacity (0.0 to 1.0) |

#### Rendering (2)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `sprite_draw!` | `id: str` | `unit` | Draw a single sprite |
| `sprite_draw_all!` | -- | `unit` | Draw all sprites in creation order |

#### Collision Detection (5)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `collides_rect!` | `id1, id2` | `bool` | AABB collision between two sprites |
| `collides_point!` | `id, px, py` | `bool` | Point-in-sprite test |
| `collides_circle!` | `id1, id2` | `bool` | Circle-based collision between two sprites |
| `collision_group!` | `id, group: str` | `unit` | Assign a sprite to a collision group |
| `check_group_collisions!` | `g1, g2, callback` | `unit` | Call `callback` for each pair of colliding sprites between two groups |

#### Object Pools (4)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `pool_create!` | `name, size: i32` | `unit` | Pre-allocate a pool of reusable sprites |
| `pool_spawn!` | `name: str` | `str` | Activate a pooled sprite and return its ID |
| `pool_recycle!` | `id: str` | `unit` | Return a sprite to its pool |
| `pool_for_each!` | `name, callback` | `unit` | Iterate over all active sprites in a pool |

### Scene & Game Loop (20 macros)

#### Scene Management (5)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `scene_register!` | `name, update_fn` | `unit` | Register a scene with its per-frame update function |
| `scene_switch!` | `name: str` | `unit` | Switch to a named scene |
| `scene_current!` | -- | `str` | Get the name of the current scene |
| `scene_push!` | `name: str` | `unit` | Push a scene onto the scene stack (for overlays/pause) |
| `scene_pop!` | -- | `unit` | Pop the top scene off the stack |

#### Game Loop (8)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `game_init!` | `title, width, height` | `unit` | Initialize the game canvas and engine |
| `game_run!` | -- | `unit` | Start the game loop (runs the current scene each frame) |
| `game_pause!` | -- | `unit` | Pause the game loop |
| `game_resume!` | -- | `unit` | Resume a paused game |
| `game_fps!` | -- | `f64` | Get the current frames-per-second |
| `delta_time!` | -- | `f64` | Seconds elapsed since the last frame |
| `elapsed_time!` | -- | `f64` | Total seconds since `game_run!` was called |
| `frame_count!` | -- | `i32` | Total frames rendered since `game_run!` |

#### Camera (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `camera_set!` | `x, y` | `unit` | Set the camera position |
| `camera_shake!` | `intensity, duration` | `unit` | Trigger a screen-shake effect |
| `camera_zoom!` | `factor: f64` | `unit` | Set the camera zoom level |

#### Timers (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `timer_set!` | `delay, callback` | `unit` | Call `callback` once after `delay` seconds |
| `timer_repeat!` | `interval, callback` | `unit` | Call `callback` every `interval` seconds |
| `timer_cancel!` | `id` | `unit` | Cancel a timer by ID |

#### Tweens (1)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `tween!` | `target, prop, from, to, duration, easing` | `unit` | Animate a property over time with easing |

### Networking (24 macros)

#### Connection (8)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `net_connect!` | `url: str` | `unit` | Connect to a WebSocket server |
| `net_disconnect!` | -- | `unit` | Disconnect from the server |
| `net_send!` | `event, data` | `unit` | Send a message to the server |
| `net_on!` | `event, callback` | `unit` | Register a handler for incoming messages |
| `net_on_disconnect!` | `callback: fn` | `unit` | Register a disconnect handler |
| `net_is_connected!` | -- | `bool` | True if currently connected |
| `net_latency!` | -- | `f64` | Round-trip latency in milliseconds |
| `net_player_id!` | -- | `str` | The local player's network ID |

#### Rooms (9)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `room_create!` | `name: str` | `unit` | Create a new room on the server |
| `room_join!` | `name: str` | `unit` | Join an existing room by name |
| `room_join_random!` | `options` | `unit` | Join a random available room |
| `room_leave!` | -- | `unit` | Leave the current room |
| `room_players!` | -- | `i32` | Number of players in the current room |
| `room_on_player_join!` | `callback: fn` | `unit` | Handler called when a player joins |
| `room_on_player_leave!` | `callback: fn` | `unit` | Handler called when a player leaves |
| `room_spectate!` | `room: str` | `unit` | Join a room as a spectator |
| `room_spectator_count!` | -- | `i32` | Number of spectators in the room |

#### State Synchronization (4)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `net_sync_pos!` | `id, x, y` | `unit` | Broadcast sprite position to other players |
| `net_sync_state!` | `key, value` | `unit` | Broadcast arbitrary state |
| `net_on_player_update!` | `callback: fn` | `unit` | Handler for incoming player state updates |
| `net_interpolate!` | `id, prop` | `f64` | Get an interpolated value for smooth remote rendering |

#### Leaderboards (3)

| Macro | Arguments | Return | Description |
|-------|-----------|--------|-------------|
| `leaderboard_submit!` | `name, score` | `unit` | Submit a score to a named leaderboard |
| `leaderboard_get!` | `name, callback` | `unit` | Fetch leaderboard entries |
| `leaderboard_rank!` | -- | `i32` | Get the local player's current rank |

---

## Runtime Architecture

When the compiler encounters game macros, it emits JavaScript that references a set of runtime objects injected into the module scope. Understanding these objects helps when debugging compiled output.

### `__canvas` / `__ctx`

The `canvas_*` macros operate on an HTML5 `<canvas>` element (`__canvas`) and its 2D rendering context (`__ctx`). `game_init!` creates both automatically. Direct `canvas_*` calls go straight to the `CanvasRenderingContext2D` API with no wrapper overhead.

### `__input`

A singleton that tracks keyboard, mouse, touch, and gamepad state. It hooks into DOM events during initialization and exposes a polling interface (`keyIsDown`, `mouseX`, etc.) that is safe to call every frame. Event-based macros (`on_key_down!`, `on_mouse_click!`, etc.) register listeners through the same object.

### `__audio`

Wraps the Web Audio API. `audio_init!` creates an `AudioContext` (must happen inside a user gesture on most browsers). The `sfx_*` macros synthesize sounds procedurally -- no asset files needed. Music macros load and control `AudioBufferSource` nodes.

### `__entity`

Manages a flat registry of sprite entities keyed by string ID. Each entity stores position, size, color, rotation, scale, opacity, spritesheet data, and collision-group membership. Object pools (`pool_*` macros) pre-allocate entities and toggle their visibility to avoid garbage collection pauses.

### `__scene` / `__game` / `__timer` / `__tween`

- **`__scene`** holds a map of named scenes (each is an update function) and a scene stack for push/pop overlays.
- **`__game`** owns the `requestAnimationFrame` loop, tracks delta time, elapsed time, frame count, FPS, and camera state.
- **`__timer`** manages one-shot and repeating timers that tick in game-time (they respect pause).
- **`__tween`** drives property animations with configurable easing.

### `__net`

WebSocket networking with room management. The runtime handles connection lifecycle, message serialization (JSON), and provides convenience methods for position/state synchronization and client-side interpolation. Leaderboard macros send HTTP requests to a configurable backend endpoint.

---

## Example Game

See the [Mini Catch Game](../examples/demos/mini-game/main.cb) for a complete playable example that demonstrates input, audio, rendering, and game-loop macros working together.

---

*This page is part of the [C! Wiki](Home). Contributions welcome.*
