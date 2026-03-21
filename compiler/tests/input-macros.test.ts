import { describe, it, expect } from 'vitest';
import { Lexer } from '../src/lexer/index.js';
import { Parser } from '../src/parser/index.js';
import { JsGenerator } from '../src/codegen/jsgen.js';

function generate(source: string): string {
  const lexer = new Lexer(source, 'test.cb');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const { program } = parser.parse();
  const gen = new JsGenerator();
  return gen.generate(program);
}

describe('input macros', () => {
  describe('keyboard', () => {
    it('key_is_down maps to __input.keyIsDown', () => {
      const js = generate(`fn main() { let pressed: bool = key_is_down!("ArrowLeft"); }`);
      expect(js).toContain('__input.keyIsDown("ArrowLeft")');
    });

    it('key_just_pressed maps to __input.keyJustPressed', () => {
      const js = generate(`fn main() { let p: bool = key_just_pressed!("Space"); }`);
      expect(js).toContain('__input.keyJustPressed("Space")');
    });

    it('key_just_released maps to __input.keyJustReleased', () => {
      const js = generate(`fn main() { let r: bool = key_just_released!("a"); }`);
      expect(js).toContain('__input.keyJustReleased("a")');
    });

    it('on_key_down maps to __input.onKeyDown', () => {
      const js = generate(`fn handler(k: String) { } fn main() { on_key_down!(handler); }`);
      expect(js).toContain('__input.onKeyDown(handler)');
    });

    it('on_key_up maps to __input.onKeyUp', () => {
      const js = generate(`fn handler(k: String) { } fn main() { on_key_up!(handler); }`);
      expect(js).toContain('__input.onKeyUp(handler)');
    });
  });

  describe('mouse', () => {
    it('mouse_x maps to __input.mouseX', () => {
      const js = generate(`fn main() { let x: f64 = mouse_x!(); }`);
      expect(js).toContain('__input.mouseX()');
    });

    it('mouse_y maps to __input.mouseY', () => {
      const js = generate(`fn main() { let y: f64 = mouse_y!(); }`);
      expect(js).toContain('__input.mouseY()');
    });

    it('mouse_is_down maps to __input.mouseIsDown', () => {
      const js = generate(`fn main() { let d: bool = mouse_is_down!(); }`);
      expect(js).toContain('__input.mouseIsDown()');
    });

    it('mouse_just_clicked maps to __input.mouseJustClicked', () => {
      const js = generate(`fn main() { let c: bool = mouse_just_clicked!(); }`);
      expect(js).toContain('__input.mouseJustClicked()');
    });

    it('on_mouse_move maps to __input.onMouseMove', () => {
      const js = generate(`fn handler(x: f64, y: f64) { } fn main() { on_mouse_move!(handler); }`);
      expect(js).toContain('__input.onMouseMove(handler)');
    });

    it('on_mouse_click maps to __input.onMouseClick', () => {
      const js = generate(`fn handler(x: f64, y: f64) { } fn main() { on_mouse_click!(handler); }`);
      expect(js).toContain('__input.onMouseClick(handler)');
    });
  });

  describe('touch', () => {
    it('touch_x maps to __input.touchX', () => {
      const js = generate(`fn main() { let x: f64 = touch_x!(); }`);
      expect(js).toContain('__input.touchX()');
    });

    it('touch_y maps to __input.touchY', () => {
      const js = generate(`fn main() { let y: f64 = touch_y!(); }`);
      expect(js).toContain('__input.touchY()');
    });

    it('touch_is_active maps to __input.touchIsActive', () => {
      const js = generate(`fn main() { let a: bool = touch_is_active!(); }`);
      expect(js).toContain('__input.touchIsActive()');
    });

    it('touch_count maps to __input.touchCount', () => {
      const js = generate(`fn main() { let c: i32 = touch_count!(); }`);
      expect(js).toContain('__input.touchCount()');
    });

    it('on_touch_start maps to __input.onTouchStart', () => {
      const js = generate(`fn handler(x: f64, y: f64) { } fn main() { on_touch_start!(handler); }`);
      expect(js).toContain('__input.onTouchStart(handler)');
    });

    it('on_touch_move maps to __input.onTouchMove', () => {
      const js = generate(`fn handler(x: f64, y: f64) { } fn main() { on_touch_move!(handler); }`);
      expect(js).toContain('__input.onTouchMove(handler)');
    });

    it('on_touch_end maps to __input.onTouchEnd', () => {
      const js = generate(`fn handler() { } fn main() { on_touch_end!(handler); }`);
      expect(js).toContain('__input.onTouchEnd(handler)');
    });
  });

  describe('gamepad', () => {
    it('gamepad_connected maps to __input.gamepadConnected', () => {
      const js = generate(`fn main() { let c: bool = gamepad_connected!(); }`);
      expect(js).toContain('__input.gamepadConnected()');
    });

    it('gamepad_axis maps to __input.gamepadAxis', () => {
      const js = generate(`fn main() { let a: f64 = gamepad_axis!(0); }`);
      expect(js).toContain('__input.gamepadAxis(0)');
    });

    it('gamepad_button maps to __input.gamepadButton', () => {
      const js = generate(`fn main() { let b: bool = gamepad_button!(0); }`);
      expect(js).toContain('__input.gamepadButton(0)');
    });
  });
});
