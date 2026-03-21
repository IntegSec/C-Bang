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

describe('scene & game loop macros', () => {
  describe('scene system', () => {
    it('scene_register maps to __scene.register', () => {
      const js = generate(`fn setup() {} fn tick(dt: f64) {} fn draw() {} fn main() { scene_register!("menu", setup, tick, draw); }`);
      expect(js).toContain('__scene.register("menu", setup, tick, draw)');
    });

    it('scene_switch maps to __scene.switchTo', () => {
      const js = generate(`fn main() { scene_switch!("game"); }`);
      expect(js).toContain('__scene.switchTo("game")');
    });

    it('scene_current maps to __scene.current', () => {
      const js = generate(`fn main() { let s: String = scene_current!(); }`);
      expect(js).toContain('__scene.current()');
    });

    it('scene_push maps to __scene.push', () => {
      const js = generate(`fn main() { scene_push!("pause"); }`);
      expect(js).toContain('__scene.push("pause")');
    });

    it('scene_pop maps to __scene.pop', () => {
      const js = generate(`fn main() { scene_pop!(); }`);
      expect(js).toContain('__scene.pop()');
    });
  });

  describe('game loop', () => {
    it('game_init maps to __game.init', () => {
      const js = generate(`fn setup() {} fn main() { game_init!(800, 600, setup); }`);
      expect(js).toContain('__game.init(800, 600, setup)');
    });

    it('game_run maps to __game.run', () => {
      const js = generate(`fn main() { game_run!(); }`);
      expect(js).toContain('__game.run()');
    });

    it('delta_time maps to __game.deltaTime', () => {
      const js = generate(`fn main() { let dt: f64 = delta_time!(); }`);
      expect(js).toContain('__game.deltaTime()');
    });

    it('elapsed_time maps to __game.elapsedTime', () => {
      const js = generate(`fn main() { let t: f64 = elapsed_time!(); }`);
      expect(js).toContain('__game.elapsedTime()');
    });

    it('frame_count maps to __game.frameCount', () => {
      const js = generate(`fn main() { let f: i32 = frame_count!(); }`);
      expect(js).toContain('__game.frameCount()');
    });

    it('game_fps maps to __game.fps', () => {
      const js = generate(`fn main() { let f: f64 = game_fps!(); }`);
      expect(js).toContain('__game.fps()');
    });

    it('game_pause maps to __game.pause', () => {
      const js = generate(`fn main() { game_pause!(); }`);
      expect(js).toContain('__game.pause()');
    });

    it('game_resume maps to __game.resume', () => {
      const js = generate(`fn main() { game_resume!(); }`);
      expect(js).toContain('__game.resume()');
    });
  });

  describe('camera', () => {
    it('camera_set maps to __game.cameraSet', () => {
      const js = generate(`fn main() { camera_set!(10.0, 20.0); }`);
      expect(js).toContain('__game.cameraSet(10.0, 20.0)');
    });

    it('camera_shake maps to __game.cameraShake', () => {
      const js = generate(`fn main() { camera_shake!(5.0, 0.3); }`);
      expect(js).toContain('__game.cameraShake(5.0, 0.3)');
    });

    it('camera_zoom maps to __game.cameraZoom', () => {
      const js = generate(`fn main() { camera_zoom!(1.5); }`);
      expect(js).toContain('__game.cameraZoom(1.5)');
    });
  });

  describe('timers', () => {
    it('timer_set maps to __timer.set', () => {
      const js = generate(`fn cb() {} fn main() { timer_set!("t1", 2.0, cb); }`);
      expect(js).toContain('__timer.set("t1", 2.0, cb)');
    });

    it('timer_repeat maps to __timer.repeat', () => {
      const js = generate(`fn cb() {} fn main() { timer_repeat!("t1", 1.0, cb); }`);
      expect(js).toContain('__timer.repeat("t1", 1.0, cb)');
    });

    it('timer_cancel maps to __timer.cancel', () => {
      const js = generate(`fn main() { timer_cancel!("t1"); }`);
      expect(js).toContain('__timer.cancel("t1")');
    });
  });

  describe('tweening', () => {
    it('tween maps to __tween.add', () => {
      const js = generate(`fn main() { tween!("player", "x", 0.0, 100.0, 1.0, "ease_out"); }`);
      expect(js).toContain('__tween.add("player", "x", 0.0, 100.0, 1.0, "ease_out")');
    });
  });
});
