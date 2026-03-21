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

describe('sprite macros', () => {
  it('sprite_create maps to __entity.create', () => {
    const js = generate(`fn main() { sprite_create!("player", 100.0, 200.0, 32.0, 48.0); }`);
    expect(js).toContain('__entity.create("player", 100.0, 200.0, 32.0, 48.0)');
  });

  it('sprite_set_pos maps to __entity.setPos', () => {
    const js = generate(`fn main() { sprite_set_pos!("player", 50.0, 60.0); }`);
    expect(js).toContain('__entity.setPos("player", 50.0, 60.0)');
  });

  it('sprite_get_x maps to __entity.getX', () => {
    const js = generate(`fn main() { let x: f64 = sprite_get_x!("player"); }`);
    expect(js).toContain('__entity.getX("player")');
  });

  it('sprite_get_y maps to __entity.getY', () => {
    const js = generate(`fn main() { let y: f64 = sprite_get_y!("player"); }`);
    expect(js).toContain('__entity.getY("player")');
  });

  it('sprite_draw maps to __entity.draw', () => {
    const js = generate(`fn main() { sprite_draw!("player"); }`);
    expect(js).toContain('__entity.draw("player")');
  });

  it('sprite_draw_all maps to __entity.drawAll', () => {
    const js = generate(`fn main() { sprite_draw_all!(); }`);
    expect(js).toContain('__entity.drawAll()');
  });

  it('collides_rect maps to __entity.collidesRect', () => {
    const js = generate(`fn main() { let hit: bool = collides_rect!("a", "b"); }`);
    expect(js).toContain('__entity.collidesRect("a", "b")');
  });

  it('collides_circle maps to __entity.collidesCircle', () => {
    const js = generate(`fn main() { let hit: bool = collides_circle!("a", "b"); }`);
    expect(js).toContain('__entity.collidesCircle("a", "b")');
  });

  it('collides_point maps to __entity.collidesPoint', () => {
    const js = generate(`fn main() { let hit: bool = collides_point!("a", 10.0, 20.0); }`);
    expect(js).toContain('__entity.collidesPoint("a", 10.0, 20.0)');
  });

  it('pool_create maps to __entity.poolCreate', () => {
    const js = generate(`fn main() { pool_create!("drops", 100); }`);
    expect(js).toContain('__entity.poolCreate("drops", 100)');
  });

  it('pool_spawn maps to __entity.poolSpawn', () => {
    const js = generate(`fn main() { let id: String = pool_spawn!("drops"); }`);
    expect(js).toContain('__entity.poolSpawn("drops")');
  });

  it('pool_recycle maps to __entity.poolRecycle', () => {
    const js = generate(`fn main() { pool_recycle!("drops", "drops_0"); }`);
    expect(js).toContain('__entity.poolRecycle("drops", "drops_0")');
  });

  it('pool_for_each maps to __entity.poolForEach', () => {
    const js = generate(`fn handler(id: String) { } fn main() { pool_for_each!("drops", handler); }`);
    expect(js).toContain('__entity.poolForEach("drops", handler)');
  });

  it('sprite_set_sheet maps to __entity.setSheet', () => {
    const js = generate(`fn main() { sprite_set_sheet!("player", 32.0, 32.0, 4); }`);
    expect(js).toContain('__entity.setSheet("player", 32.0, 32.0, 4)');
  });

  it('sprite_set_rotation maps to __entity.setRotation', () => {
    const js = generate(`fn main() { sprite_set_rotation!("player", 1.57); }`);
    expect(js).toContain('__entity.setRotation("player", 1.57)');
  });

  it('sprite_set_opacity maps to __entity.setOpacity', () => {
    const js = generate(`fn main() { sprite_set_opacity!("player", 0.5); }`);
    expect(js).toContain('__entity.setOpacity("player", 0.5)');
  });

  it('sprite_destroy maps to __entity.destroy', () => {
    const js = generate(`fn main() { sprite_destroy!("player"); }`);
    expect(js).toContain('__entity.destroy("player")');
  });

  it('sprite_set_size maps to __entity.setSize', () => {
    const js = generate(`fn main() { sprite_set_size!("player", 64.0, 64.0); }`);
    expect(js).toContain('__entity.setSize("player", 64.0, 64.0)');
  });

  it('sprite_set_color maps to __entity.setColor', () => {
    const js = generate(`fn main() { sprite_set_color!("player", "#ff0000"); }`);
    expect(js).toContain('__entity.setColor("player", "#ff0000")');
  });

  it('sprite_set_visible maps to __entity.setVisible', () => {
    const js = generate(`fn main() { sprite_set_visible!("player", false); }`);
    expect(js).toContain('__entity.setVisible("player", false)');
  });

  it('sprite_get_width maps to __entity.getW', () => {
    const js = generate(`fn main() { let w: f64 = sprite_get_width!("player"); }`);
    expect(js).toContain('__entity.getW("player")');
  });

  it('sprite_get_height maps to __entity.getH', () => {
    const js = generate(`fn main() { let h: f64 = sprite_get_height!("player"); }`);
    expect(js).toContain('__entity.getH("player")');
  });

  it('sprite_load_image maps to __entity.loadImage', () => {
    const js = generate(`fn main() { sprite_load_image!("player", "player.png"); }`);
    expect(js).toContain('__entity.loadImage("player", "player.png")');
  });

  it('sprite_set_frame maps to __entity.setFrame', () => {
    const js = generate(`fn main() { sprite_set_frame!("player", 3); }`);
    expect(js).toContain('__entity.setFrame("player", 3)');
  });

  it('sprite_set_scale maps to __entity.setScale', () => {
    const js = generate(`fn main() { sprite_set_scale!("player", 2.0, 2.0); }`);
    expect(js).toContain('__entity.setScale("player", 2.0, 2.0)');
  });

  it('collision_group maps to __entity.collisionGroup', () => {
    const js = generate(`fn main() { collision_group!("player", "players"); }`);
    expect(js).toContain('__entity.collisionGroup("player", "players")');
  });

  it('check_group_collisions maps to __entity.checkGroupCollisions', () => {
    const js = generate(`fn cb(a: String, b: String) {} fn main() { check_group_collisions!("players", "drops", cb); }`);
    expect(js).toContain('__entity.checkGroupCollisions("players", "drops", cb)');
  });
});
