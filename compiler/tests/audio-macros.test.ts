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

describe('audio macros', () => {
  it('audio_init maps to __audio.init', () => {
    const js = generate(`fn main() { audio_init!(); }`);
    expect(js).toContain('__audio.init()');
  });

  it('audio_beep maps to __audio.beep', () => {
    const js = generate(`fn main() { audio_beep!(440.0, 0.1, 0.5); }`);
    expect(js).toContain('__audio.beep(440.0, 0.1, 0.5)');
  });

  it('audio_noise maps to __audio.noise', () => {
    const js = generate(`fn main() { audio_noise!(0.2, 0.3); }`);
    expect(js).toContain('__audio.noise(0.2, 0.3)');
  });

  it('audio_sweep maps to __audio.sweep', () => {
    const js = generate(`fn main() { audio_sweep!(440.0, 880.0, 0.3, 0.5); }`);
    expect(js).toContain('__audio.sweep(440.0, 880.0, 0.3, 0.5)');
  });

  it('sfx_coin maps to __audio.sfxCoin', () => {
    const js = generate(`fn main() { sfx_coin!(); }`);
    expect(js).toContain('__audio.sfxCoin()');
  });

  it('sfx_hit maps to __audio.sfxHit', () => {
    const js = generate(`fn main() { sfx_hit!(); }`);
    expect(js).toContain('__audio.sfxHit()');
  });

  it('sfx_powerup maps to __audio.sfxPowerup', () => {
    const js = generate(`fn main() { sfx_powerup!(); }`);
    expect(js).toContain('__audio.sfxPowerup()');
  });

  it('sfx_levelup maps to __audio.sfxLevelup', () => {
    const js = generate(`fn main() { sfx_levelup!(); }`);
    expect(js).toContain('__audio.sfxLevelup()');
  });

  it('sfx_gameover maps to __audio.sfxGameover', () => {
    const js = generate(`fn main() { sfx_gameover!(); }`);
    expect(js).toContain('__audio.sfxGameover()');
  });

  it('sfx_combo maps to __audio.sfxCombo', () => {
    const js = generate(`fn main() { sfx_combo!(5); }`);
    expect(js).toContain('__audio.sfxCombo(5)');
  });

  it('sfx_fizz maps to __audio.sfxFizz', () => {
    const js = generate(`fn main() { sfx_fizz!(); }`);
    expect(js).toContain('__audio.sfxFizz()');
  });

  it('music_play maps to __audio.musicPlay', () => {
    const js = generate(`fn main() { music_play!("bg.mp3"); }`);
    expect(js).toContain('__audio.musicPlay("bg.mp3")');
  });

  it('music_stop maps to __audio.musicStop', () => {
    const js = generate(`fn main() { music_stop!(); }`);
    expect(js).toContain('__audio.musicStop()');
  });

  it('music_volume maps to __audio.musicVolume', () => {
    const js = generate(`fn main() { music_volume!(0.5); }`);
    expect(js).toContain('__audio.musicVolume(0.5)');
  });

  it('audio_master_volume maps to __audio.masterVolume', () => {
    const js = generate(`fn main() { audio_master_volume!(0.8); }`);
    expect(js).toContain('__audio.masterVolume(0.8)');
  });

  it('audio_mute maps to __audio.mute', () => {
    const js = generate(`fn main() { audio_mute!(); }`);
    expect(js).toContain('__audio.mute()');
  });

  it('audio_unmute maps to __audio.unmute', () => {
    const js = generate(`fn main() { audio_unmute!(); }`);
    expect(js).toContain('__audio.unmute()');
  });
});
