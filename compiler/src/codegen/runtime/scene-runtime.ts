/**
 * Scene & Game Loop runtime.
 * Provides __scene, __game, __timer, __tween objects.
 */
export const SCENE_RUNTIME = `
var __timer = (function() {
  var timers = {};
  return {
    set: function(id, dur, cb) { timers[id] = { remaining: dur, cb: cb, repeat: false, interval: dur }; },
    repeat: function(id, interval, cb) { timers[id] = { remaining: interval, cb: cb, repeat: true, interval: interval }; },
    cancel: function(id) { delete timers[id]; },
    step: function(dt) {
      var ids = Object.keys(timers);
      for (var i = 0; i < ids.length; i++) {
        var t = timers[ids[i]];
        t.remaining -= dt;
        if (t.remaining <= 0) {
          t.cb();
          if (t.repeat) { t.remaining += t.interval; }
          else { delete timers[ids[i]]; }
        }
      }
    },
  };
})();

var __tween = (function() {
  var tweens = [];
  var easings = {
    linear: function(t) { return t; },
    ease_in: function(t) { return t * t; },
    ease_out: function(t) { return t * (2 - t); },
    ease_in_out: function(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    bounce: function(t) { if (t < 1/2.75) return 7.5625*t*t; if (t < 2/2.75) return 7.5625*(t-=1.5/2.75)*t+0.75; if (t < 2.5/2.75) return 7.5625*(t-=2.25/2.75)*t+0.9375; return 7.5625*(t-=2.625/2.75)*t+0.984375; },
    elastic: function(t) { return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10*(t-1)) * Math.sin((t-1.1)*5*Math.PI); },
  };
  return {
    add: function(targetId, prop, from, to, dur, easing) {
      tweens.push({ targetId: targetId, prop: prop, from: from, to: to, dur: dur, elapsed: 0, easing: easings[easing] || easings.linear });
    },
    step: function(dt) {
      for (var i = tweens.length - 1; i >= 0; i--) {
        var tw = tweens[i];
        tw.elapsed += dt;
        var t = Math.min(tw.elapsed / tw.dur, 1);
        var val = tw.from + (tw.to - tw.from) * tw.easing(t);
        if (typeof __entity !== 'undefined') {
          var s = __entity;
          if (tw.prop === 'x') s.setPos(tw.targetId, val, s.getY(tw.targetId));
          else if (tw.prop === 'y') s.setPos(tw.targetId, s.getX(tw.targetId), val);
          else if (tw.prop === 'opacity') s.setOpacity(tw.targetId, val);
          else if (tw.prop === 'rotation') s.setRotation(tw.targetId, val);
        }
        if (t >= 1) tweens.splice(i, 1);
      }
    },
  };
})();

var __scene = (function() {
  var scenes = {};
  var stack = [];
  return {
    register: function(name, initFn, updateFn, renderFn) {
      scenes[name] = { init: initFn, update: updateFn, render: renderFn };
    },
    switchTo: function(name) {
      stack = [name];
      if (scenes[name] && scenes[name].init) scenes[name].init();
    },
    current: function() { return stack.length > 0 ? stack[stack.length - 1] : ''; },
    push: function(name) {
      stack.push(name);
      if (scenes[name] && scenes[name].init) scenes[name].init();
    },
    pop: function() {
      if (stack.length > 1) stack.pop();
      return __scene.current();
    },
    getUpdate: function() { var s = scenes[__scene.current()]; return s ? s.update : null; },
    getRender: function() { var s = scenes[__scene.current()]; return s ? s.render : null; },
  };
})();

var __game = (function() {
  var startTime = 0;
  var lastTime = 0;
  var dt = 0;
  var frames = 0;
  var fps = 0;
  var fpsAccum = 0;
  var fpsFrames = 0;
  var paused = false;
  var cameraX = 0, cameraY = 0;
  var shakeIntensity = 0, shakeDuration = 0, shakeElapsed = 0;
  var zoomLevel = 1;
  var initFn = null;

  function loop(timestamp) {
    if (!startTime) { startTime = timestamp; lastTime = timestamp; }
    var rawDt = (timestamp - lastTime) / 1000;
    dt = Math.min(rawDt, 0.1);
    lastTime = timestamp;

    fpsAccum += rawDt;
    fpsFrames++;
    if (fpsAccum >= 1) { fps = fpsFrames; fpsFrames = 0; fpsAccum = 0; }

    if (!paused) {
      // Step 1: Poll input (gamepad state refresh)
      if (typeof __input !== 'undefined' && __input.gamepadConnected) __input.gamepadConnected();

      // Step 2: Timers (may affect game state)
      __timer.step(dt);

      // Step 3: Tweens (may move sprites)
      __tween.step(dt);

      // Step 4: Scene update
      var updateFn = __scene.getUpdate();
      if (updateFn) updateFn(dt);

      // Step 5: Render with camera transforms
      __ctx.save();
      var ox = cameraX, oy = cameraY;
      if (shakeIntensity > 0) {
        shakeElapsed += dt;
        var factor = 1 - (shakeElapsed / shakeDuration);
        if (factor <= 0) { shakeIntensity = 0; }
        else { ox += (Math.random() - 0.5) * shakeIntensity * factor * 2; oy += (Math.random() - 0.5) * shakeIntensity * factor * 2; }
      }
      __ctx.translate(ox, oy);
      __ctx.scale(zoomLevel, zoomLevel);

      var renderFn = __scene.getRender();
      if (renderFn) renderFn();

      __ctx.restore();

      // Step 6: Reset per-frame input flags
      if (typeof __input !== 'undefined' && __input.resetFrame) __input.resetFrame();
      frames++;
    }

    requestAnimationFrame(loop);
  }

  return {
    init: function(w, h, fn) {
      __canvas.width = w;
      __canvas.height = h;
      initFn = fn;
      if (fn) fn();
    },
    run: function() { requestAnimationFrame(loop); },
    pause: function() { paused = true; },
    resume: function() { paused = false; },
    fps: function() { return fps; },
    deltaTime: function() { return dt; },
    elapsedTime: function() { return (lastTime - startTime) / 1000; },
    frameCount: function() { return frames; },
    cameraSet: function(x, y) { cameraX = x; cameraY = y; },
    cameraShake: function(intensity, duration) { shakeIntensity = intensity; shakeDuration = duration; shakeElapsed = 0; },
    cameraZoom: function(level) { zoomLevel = level; },
  };
})();
`;
