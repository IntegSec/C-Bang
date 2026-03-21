import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes, unitType } from '../../checker/macro-types.js';

const audioHandlers: Record<string, (args: string) => string> = {
  audio_init: () => '__audio.init()',
  audio_beep: (args) => `__audio.beep(${args})`,
  audio_noise: (args) => `__audio.noise(${args})`,
  audio_sweep: (args) => `__audio.sweep(${args})`,

  sfx_coin: () => '__audio.sfxCoin()',
  sfx_hit: () => '__audio.sfxHit()',
  sfx_powerup: () => '__audio.sfxPowerup()',
  sfx_levelup: () => '__audio.sfxLevelup()',
  sfx_gameover: () => '__audio.sfxGameover()',
  sfx_combo: (args) => `__audio.sfxCombo(${args})`,
  sfx_fizz: () => '__audio.sfxFizz()',

  music_play: (args) => `__audio.musicPlay(${args})`,
  music_stop: () => '__audio.musicStop()',
  music_volume: (args) => `__audio.musicVolume(${args})`,

  audio_master_volume: (args) => `__audio.masterVolume(${args})`,
  audio_mute: () => '__audio.mute()',
  audio_unmute: () => '__audio.unmute()',
};

export function registerAudioMacros(): void {
  registerMacros(audioHandlers as any);

  const audioTypes: Record<string, typeof unitType> = {};
  for (const name of Object.keys(audioHandlers)) {
    audioTypes[name] = unitType;
  }
  registerMacroTypes(audioTypes);
}
