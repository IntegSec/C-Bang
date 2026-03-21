/**
 * Audio runtime — injected into the iframe/execution context.
 * Provides __audio object for synthesized sounds, SFX presets, and music.
 */
export const AUDIO_RUNTIME = `
var __audio = (function() {
  var ctx = null;
  var masterGain = null;
  var musicEl = null;
  var muted = false;

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function beep(freq, dur, vol) {
    var c = ensureCtx();
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.frequency.value = freq;
    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.1));
    osc.stop(c.currentTime + (dur || 0.1) + 0.05);
  }

  function noise(dur, vol) {
    var c = ensureCtx();
    var bufSize = c.sampleRate * (dur || 0.1);
    var buf = c.createBuffer(1, bufSize, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource();
    src.buffer = buf;
    var gain = c.createGain();
    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);
    src.connect(gain);
    gain.connect(masterGain);
    src.start();
    src.stop(c.currentTime + (dur || 0.1));
  }

  function sweep(f1, f2, dur, vol) {
    var c = ensureCtx();
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.frequency.value = f1;
    osc.frequency.linearRampToValueAtTime(f2, c.currentTime + (dur || 0.3));
    gain.gain.value = (vol !== undefined ? vol : 0.3) * (muted ? 0 : 1);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.3));
    osc.stop(c.currentTime + (dur || 0.3) + 0.05);
  }

  return {
    init: function() { ensureCtx(); },
    beep: beep,
    noise: noise,
    sweep: sweep,

    // SFX presets
    sfxCoin: function() { beep(880, 0.08, 0.3); setTimeout(function() { beep(1108, 0.12, 0.3); }, 80); },
    sfxHit: function() { beep(200, 0.15, 0.5); noise(0.05, 0.3); },
    sfxPowerup: function() { beep(440, 0.08, 0.3); setTimeout(function() { beep(554, 0.08, 0.3); }, 80); setTimeout(function() { beep(659, 0.12, 0.3); }, 160); },
    sfxLevelup: function() { beep(523, 0.1, 0.3); setTimeout(function() { beep(659, 0.1, 0.3); }, 100); setTimeout(function() { beep(784, 0.1, 0.3); }, 200); setTimeout(function() { beep(1047, 0.2, 0.4); }, 300); },
    sfxGameover: function() { beep(440, 0.2, 0.4); setTimeout(function() { beep(370, 0.2, 0.4); }, 200); setTimeout(function() { beep(311, 0.3, 0.3); }, 400); },
    sfxCombo: function(mult) { var f = 600 + (mult * 50); beep(f, 0.06, 0.3); setTimeout(function() { beep(f * 1.25, 0.08, 0.3); }, 60); },
    sfxFizz: function() {
      var c = ensureCtx();
      var bufSize = c.sampleRate * 0.4;
      var buf = c.createBuffer(1, bufSize, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource();
      src.buffer = buf;
      var filter = c.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;
      var gain = c.createGain();
      gain.gain.value = 0.3 * (muted ? 0 : 1);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      src.start();
      src.stop(c.currentTime + 0.4);
    },

    musicPlay: function(url) {
      if (musicEl) { musicEl.pause(); musicEl = null; }
      musicEl = new Audio(url);
      musicEl.loop = true;
      musicEl.volume = muted ? 0 : 0.5;
      musicEl.play().catch(function() {});
    },
    musicStop: function() { if (musicEl) { musicEl.pause(); musicEl.currentTime = 0; } },
    musicVolume: function(v) { if (musicEl) musicEl.volume = muted ? 0 : v; },

    masterVolume: function(v) { if (masterGain) masterGain.gain.value = v; },
    mute: function() { muted = true; if (masterGain) masterGain.gain.value = 0; if (musicEl) musicEl.volume = 0; },
    unmute: function() { muted = false; if (masterGain) masterGain.gain.value = 1; if (musicEl) musicEl.volume = 0.5; },
  };
})();
`;
