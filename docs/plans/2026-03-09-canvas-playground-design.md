# Canvas Playground Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add canvas graphics support to the C! playground so C! code can render 2D/3D graphics in the browser.

**Architecture:** Extend the JS codegen's macro mapping to include canvas and math built-in functions. Modify the playground iframe to include a canvas element and relay the rendered image back to the parent via postMessage.

**Tech Stack:** TypeScript (codegen), HTML5 Canvas API, JavaScript (playground)

---

## Graphics API

Canvas macros mapped in codegen:

- `canvas_size!(w, h)` → set canvas dimensions
- `canvas_clear!()` → clear canvas
- `canvas_fill_style!(color)` → set fill color
- `canvas_stroke_style!(color)` → set stroke color
- `canvas_line_width!(w)` → set line width
- `canvas_fill_rect!(x,y,w,h)` → fill rectangle
- `canvas_stroke_rect!(x,y,w,h)` → stroke rectangle
- `canvas_line!(x1,y1,x2,y2)` → draw line
- `canvas_circle!(x,y,r)` → fill circle
- `canvas_text!(text,x,y)` → draw text
- `canvas_font!(font)` → set font
- `canvas_begin_path!()` → begin path
- `canvas_move_to!(x,y)` → move to
- `canvas_line_to!(x,y)` → line to
- `canvas_close_path!()` → close path
- `canvas_fill!()` → fill path
- `canvas_stroke!()` → stroke path

Math macros:

- `math_sin!(x)` → Math.sin(x)
- `math_cos!(x)` → Math.cos(x)
- `math_sqrt!(x)` → Math.sqrt(x)
- `math_floor!(x)` → Math.floor(x)

## Playground Changes

- Iframe HTML gets `<canvas id="c">`
- Inject canvas setup before user code
- After execution, serialize canvas to dataURL via postMessage
- New Canvas Output panel shown when canvas functions detected
- Display returned image

## 3D Cube Example

- 4x4 rotation matrices with perspective projection
- Wireframe cube with colored edges
- Uses math_sin!/math_cos! builtins
