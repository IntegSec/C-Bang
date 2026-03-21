import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes, boolType, f64Type, stringType, unitType } from '../../checker/macro-types.js';

const spriteHandlers: Record<string, (args: string) => string> = {
  sprite_create: (args) => `__entity.create(${args})`,
  sprite_set_pos: (args) => `__entity.setPos(${args})`,
  sprite_set_size: (args) => `__entity.setSize(${args})`,
  sprite_set_color: (args) => `__entity.setColor(${args})`,
  sprite_set_visible: (args) => `__entity.setVisible(${args})`,
  sprite_get_x: (args) => `__entity.getX(${args})`,
  sprite_get_y: (args) => `__entity.getY(${args})`,
  sprite_get_width: (args) => `__entity.getW(${args})`,
  sprite_get_height: (args) => `__entity.getH(${args})`,
  sprite_destroy: (args) => `__entity.destroy(${args})`,

  sprite_load_image: (args) => `__entity.loadImage(${args})`,
  sprite_set_sheet: (args) => `__entity.setSheet(${args})`,
  sprite_set_frame: (args) => `__entity.setFrame(${args})`,
  sprite_set_rotation: (args) => `__entity.setRotation(${args})`,
  sprite_set_scale: (args) => `__entity.setScale(${args})`,
  sprite_set_opacity: (args) => `__entity.setOpacity(${args})`,

  sprite_draw: (args) => `__entity.draw(${args})`,
  sprite_draw_all: () => '__entity.drawAll()',

  collides_rect: (args) => `__entity.collidesRect(${args})`,
  collides_point: (args) => `__entity.collidesPoint(${args})`,
  collides_circle: (args) => `__entity.collidesCircle(${args})`,
  collision_group: (args) => `__entity.collisionGroup(${args})`,
  check_group_collisions: (args) => `__entity.checkGroupCollisions(${args})`,

  pool_create: (args) => `__entity.poolCreate(${args})`,
  pool_spawn: (args) => `__entity.poolSpawn(${args})`,
  pool_recycle: (args) => `__entity.poolRecycle(${args})`,
  pool_for_each: (args) => `__entity.poolForEach(${args})`,
};

export function registerSpriteMacros(): void {
  registerMacros(spriteHandlers as any);

  registerMacroTypes({
    sprite_create: unitType, sprite_set_pos: unitType, sprite_set_size: unitType,
    sprite_set_color: unitType, sprite_set_visible: unitType,
    sprite_get_x: f64Type, sprite_get_y: f64Type,
    sprite_get_width: f64Type, sprite_get_height: f64Type,
    sprite_destroy: unitType,
    sprite_load_image: unitType, sprite_set_sheet: unitType, sprite_set_frame: unitType,
    sprite_set_rotation: unitType, sprite_set_scale: unitType, sprite_set_opacity: unitType,
    sprite_draw: unitType, sprite_draw_all: unitType,
    collides_rect: boolType, collides_point: boolType, collides_circle: boolType,
    collision_group: unitType, check_group_collisions: unitType,
    pool_create: unitType, pool_spawn: stringType, pool_recycle: unitType, pool_for_each: unitType,
  });
}
