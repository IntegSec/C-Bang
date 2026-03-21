/**
 * Input runtime — injected into the iframe/execution context.
 * Provides __input object that tracks keyboard, mouse, touch, and gamepad state.
 */
export const INPUT_RUNTIME = `
var __input = (function() {
  var keys = {};
  var justPressed = {};
  var justReleased = {};
  var mouseState = { x: 0, y: 0, down: false, justClicked: false };
  var touchState = { x: 0, y: 0, active: false, count: 0 };
  var gamepadState = { connected: false, axes: [0,0,0,0], buttons: [] };
  var callbacks = { keydown: [], keyup: [], mousemove: [], mouseclick: [], touchstart: [], touchmove: [], touchend: [] };

  document.addEventListener('keydown', function(e) {
    if (!keys[e.key]) justPressed[e.key] = true;
    keys[e.key] = true;
    for (var i = 0; i < callbacks.keydown.length; i++) callbacks.keydown[i](e.key);
    e.preventDefault();
  });
  document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    justReleased[e.key] = true;
    for (var i = 0; i < callbacks.keyup.length; i++) callbacks.keyup[i](e.key);
  });

  var canvas = document.getElementById('c') || document.querySelector('canvas') || document.body;
  canvas.addEventListener('mousemove', function(e) {
    var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });
    mouseState.x = e.clientX - rect.left;
    mouseState.y = e.clientY - rect.top;
    for (var i = 0; i < callbacks.mousemove.length; i++) callbacks.mousemove[i](mouseState.x, mouseState.y);
  });
  canvas.addEventListener('mousedown', function(e) {
    mouseState.down = true;
    mouseState.justClicked = true;
    for (var i = 0; i < callbacks.mouseclick.length; i++) callbacks.mouseclick[i](mouseState.x, mouseState.y);
  });
  canvas.addEventListener('mouseup', function(e) { mouseState.down = false; });

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    touchState.active = true;
    touchState.count = e.touches.length;
    if (e.touches.length > 0) {
      var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });
      touchState.x = e.touches[0].clientX - rect.left;
      touchState.y = e.touches[0].clientY - rect.top;
    }
    for (var i = 0; i < callbacks.touchstart.length; i++) callbacks.touchstart[i](touchState.x, touchState.y);
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    touchState.count = e.touches.length;
    if (e.touches.length > 0) {
      var rect = (canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { left: 0, top: 0 });
      touchState.x = e.touches[0].clientX - rect.left;
      touchState.y = e.touches[0].clientY - rect.top;
    }
    for (var i = 0; i < callbacks.touchmove.length; i++) callbacks.touchmove[i](touchState.x, touchState.y);
  }, { passive: false });
  canvas.addEventListener('touchend', function(e) {
    touchState.count = e.touches.length;
    if (e.touches.length === 0) touchState.active = false;
    for (var i = 0; i < callbacks.touchend.length; i++) callbacks.touchend[i]();
  });

  window.addEventListener('gamepadconnected', function() { gamepadState.connected = true; });
  window.addEventListener('gamepaddisconnected', function() { gamepadState.connected = false; });

  return {
    keyIsDown: function(k) { return !!keys[k]; },
    keyJustPressed: function(k) { return !!justPressed[k]; },
    keyJustReleased: function(k) { return !!justReleased[k]; },
    onKeyDown: function(cb) { callbacks.keydown.push(cb); },
    onKeyUp: function(cb) { callbacks.keyup.push(cb); },
    mouseX: function() { return mouseState.x; },
    mouseY: function() { return mouseState.y; },
    mouseIsDown: function() { return mouseState.down; },
    mouseJustClicked: function() { return mouseState.justClicked; },
    onMouseMove: function(cb) { callbacks.mousemove.push(cb); },
    onMouseClick: function(cb) { callbacks.mouseclick.push(cb); },
    touchX: function() { return touchState.x; },
    touchY: function() { return touchState.y; },
    touchIsActive: function() { return touchState.active; },
    touchCount: function() { return touchState.count; },
    onTouchStart: function(cb) { callbacks.touchstart.push(cb); },
    onTouchMove: function(cb) { callbacks.touchmove.push(cb); },
    onTouchEnd: function(cb) { callbacks.touchend.push(cb); },
    gamepadConnected: function() {
      gamepadState.connected = false;
      var gps = navigator.getGamepads ? navigator.getGamepads() : [];
      for (var i = 0; i < gps.length; i++) { if (gps[i]) { gamepadState.connected = true; break; } }
      return gamepadState.connected;
    },
    gamepadAxis: function(idx) {
      var gps = navigator.getGamepads ? navigator.getGamepads() : [];
      for (var i = 0; i < gps.length; i++) {
        if (gps[i] && gps[i].axes[idx] !== undefined) return gps[i].axes[idx];
      }
      return 0;
    },
    gamepadButton: function(idx) {
      var gps = navigator.getGamepads ? navigator.getGamepads() : [];
      for (var i = 0; i < gps.length; i++) {
        if (gps[i] && gps[i].buttons[idx]) return gps[i].buttons[idx].pressed;
      }
      return false;
    },
    resetFrame: function() {
      justPressed = {};
      justReleased = {};
      mouseState.justClicked = false;
    }
  };
})();
`;
