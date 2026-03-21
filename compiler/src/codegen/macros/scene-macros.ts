import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes, f64Type, i32Type, stringType, unitType } from '../../checker/macro-types.js';

const sceneHandlers: Record<string, (args: string) => string> = {
  scene_register: (args) => `__scene.register(${args})`,
  scene_switch: (args) => `__scene.switchTo(${args})`,
  scene_current: () => '__scene.current()',
  scene_push: (args) => `__scene.push(${args})`,
  scene_pop: () => '__scene.pop()',

  game_init: (args) => `__game.init(${args})`,
  game_run: () => '__game.run()',
  game_pause: () => '__game.pause()',
  game_resume: () => '__game.resume()',
  game_fps: () => '__game.fps()',
  delta_time: () => '__game.deltaTime()',
  elapsed_time: () => '__game.elapsedTime()',
  frame_count: () => '__game.frameCount()',

  camera_set: (args) => `__game.cameraSet(${args})`,
  camera_shake: (args) => `__game.cameraShake(${args})`,
  camera_zoom: (args) => `__game.cameraZoom(${args})`,

  timer_set: (args) => `__timer.set(${args})`,
  timer_repeat: (args) => `__timer.repeat(${args})`,
  timer_cancel: (args) => `__timer.cancel(${args})`,

  tween: (args) => `__tween.add(${args})`,
};

export function registerSceneMacros(): void {
  registerMacros(sceneHandlers as any);

  registerMacroTypes({
    scene_register: unitType, scene_switch: unitType, scene_current: stringType,
    scene_push: unitType, scene_pop: unitType,
    game_init: unitType, game_run: unitType, game_pause: unitType, game_resume: unitType,
    game_fps: f64Type, delta_time: f64Type, elapsed_time: f64Type, frame_count: i32Type,
    camera_set: unitType, camera_shake: unitType, camera_zoom: unitType,
    timer_set: unitType, timer_repeat: unitType, timer_cancel: unitType,
    tween: unitType,
  });
}
