import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes, boolType, f64Type, i32Type, unitType } from '../../checker/macro-types.js';

const inputHandlers: Record<string, (args: string) => string> = {
  // Keyboard
  key_is_down: (args) => `__input.keyIsDown(${args})`,
  key_just_pressed: (args) => `__input.keyJustPressed(${args})`,
  key_just_released: (args) => `__input.keyJustReleased(${args})`,
  on_key_down: (args) => `__input.onKeyDown(${args})`,
  on_key_up: (args) => `__input.onKeyUp(${args})`,

  // Mouse
  mouse_x: () => '__input.mouseX()',
  mouse_y: () => '__input.mouseY()',
  mouse_is_down: () => '__input.mouseIsDown()',
  mouse_just_clicked: () => '__input.mouseJustClicked()',
  on_mouse_move: (args) => `__input.onMouseMove(${args})`,
  on_mouse_click: (args) => `__input.onMouseClick(${args})`,

  // Touch
  touch_x: () => '__input.touchX()',
  touch_y: () => '__input.touchY()',
  touch_is_active: () => '__input.touchIsActive()',
  touch_count: () => '__input.touchCount()',
  on_touch_start: (args) => `__input.onTouchStart(${args})`,
  on_touch_move: (args) => `__input.onTouchMove(${args})`,
  on_touch_end: (args) => `__input.onTouchEnd(${args})`,

  // Gamepad
  gamepad_connected: () => '__input.gamepadConnected()',
  gamepad_axis: (args) => `__input.gamepadAxis(${args})`,
  gamepad_button: (args) => `__input.gamepadButton(${args})`,
};

export function registerInputMacros(): void {
  registerMacros(inputHandlers as any);

  registerMacroTypes({
    key_is_down: boolType,
    key_just_pressed: boolType,
    key_just_released: boolType,
    on_key_down: unitType,
    on_key_up: unitType,
    mouse_x: f64Type,
    mouse_y: f64Type,
    mouse_is_down: boolType,
    mouse_just_clicked: boolType,
    on_mouse_move: unitType,
    on_mouse_click: unitType,
    touch_x: f64Type,
    touch_y: f64Type,
    touch_is_active: boolType,
    touch_count: i32Type,
    on_touch_start: unitType,
    on_touch_move: unitType,
    on_touch_end: unitType,
    gamepad_connected: boolType,
    gamepad_axis: f64Type,
    gamepad_button: boolType,
  });
}
