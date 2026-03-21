import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes } from '../../checker/macro-types.js';
import { unitType } from '../../checker/macro-types.js';

const canvasMacros: Record<string, (args: string, rawArgs: string[]) => string> = {
  canvas_size: (_args, rawArgs) =>
    `(() => { __canvas.width = ${rawArgs[0] ?? '400'}; __canvas.height = ${rawArgs[1] ?? '400'}; })()`,
  canvas_clear: () =>
    `__ctx.clearRect(0, 0, __canvas.width, __canvas.height)`,
  canvas_fill_style: (args) =>
    `(() => { __ctx.fillStyle = ${args}; })()`,
  canvas_stroke_style: (args) =>
    `(() => { __ctx.strokeStyle = ${args}; })()`,
  canvas_line_width: (args) =>
    `(() => { __ctx.lineWidth = ${args}; })()`,
  canvas_fill_rect: (args) =>
    `__ctx.fillRect(${args})`,
  canvas_stroke_rect: (args) =>
    `__ctx.strokeRect(${args})`,
  canvas_line: (_args, rawArgs) =>
    `(() => { __ctx.beginPath(); __ctx.moveTo(${rawArgs[0]}, ${rawArgs[1]}); __ctx.lineTo(${rawArgs[2]}, ${rawArgs[3]}); __ctx.stroke(); })()`,
  canvas_circle: (_args, rawArgs) =>
    `(() => { __ctx.beginPath(); __ctx.arc(${rawArgs[0]}, ${rawArgs[1]}, ${rawArgs[2]}, 0, 2 * Math.PI); __ctx.fill(); })()`,
  canvas_text: (args) =>
    `__ctx.fillText(${args})`,
  canvas_font: (args) =>
    `(() => { __ctx.font = ${args}; })()`,
  canvas_begin_path: () =>
    `__ctx.beginPath()`,
  canvas_move_to: (args) =>
    `__ctx.moveTo(${args})`,
  canvas_line_to: (args) =>
    `__ctx.lineTo(${args})`,
  canvas_close_path: () =>
    `__ctx.closePath()`,
  canvas_fill: () =>
    `__ctx.fill()`,
  canvas_stroke: () =>
    `__ctx.stroke()`,
  canvas_save: () =>
    `__ctx.save()`,
  canvas_restore: () =>
    `__ctx.restore()`,
  canvas_translate: (args) =>
    `__ctx.translate(${args})`,
  canvas_rotate: (args) =>
    `__ctx.rotate(${args})`,
  canvas_scale: (args) =>
    `__ctx.scale(${args})`,
  canvas_animate: (args) =>
    `(function __animLoop() { ${args}(); requestAnimationFrame(__animLoop); })()`,
};

export function registerCanvasMacros(): void {
  registerMacros(canvasMacros);

  const canvasTypes: Record<string, typeof unitType> = {};
  for (const name of Object.keys(canvasMacros)) {
    canvasTypes[name] = unitType;
  }
  registerMacroTypes(canvasTypes);
}
