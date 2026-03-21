import { registerMacros } from '../macro-registry.js';
import { registerMacroTypes, boolType, f64Type, i32Type, stringType, unitType } from '../../checker/macro-types.js';

const netHandlers: Record<string, (args: string) => string> = {
  net_connect: (args) => `__net.connect(${args})`,
  net_disconnect: () => '__net.disconnect()',
  net_send: (args) => `__net.send(${args})`,
  net_on: (args) => `__net.on(${args})`,
  net_on_disconnect: (args) => `__net.onDisconnect(${args})`,
  net_is_connected: () => '__net.isConnected()',
  net_latency: () => '__net.latency()',
  net_player_id: () => '__net.playerId()',

  room_create: (args) => `__net.roomCreate(${args})`,
  room_join: (args) => `__net.roomJoin(${args})`,
  room_join_random: (args) => `__net.roomJoinRandom(${args})`,
  room_leave: () => '__net.roomLeave()',
  room_players: () => '__net.roomPlayers()',
  room_on_player_join: (args) => `__net.roomOnPlayerJoin(${args})`,
  room_on_player_leave: (args) => `__net.roomOnPlayerLeave(${args})`,
  room_spectate: (args) => `__net.roomSpectate(${args})`,
  room_spectator_count: () => '__net.roomSpectatorCount()',

  net_sync_pos: (args) => `__net.syncPos(${args})`,
  net_sync_state: (args) => `__net.syncState(${args})`,
  net_on_player_update: (args) => `__net.onPlayerUpdate(${args})`,
  net_interpolate: (args) => `__net.interpolate(${args})`,

  leaderboard_submit: (args) => `__net.leaderboardSubmit(${args})`,
  leaderboard_get: (args) => `__net.leaderboardGet(${args})`,
  leaderboard_rank: () => '__net.leaderboardRank()',
};

export function registerNetMacros(): void {
  registerMacros(netHandlers as any);

  registerMacroTypes({
    net_connect: unitType, net_disconnect: unitType, net_send: unitType,
    net_on: unitType, net_on_disconnect: unitType,
    net_is_connected: boolType, net_latency: f64Type, net_player_id: stringType,
    room_create: unitType, room_join: unitType, room_join_random: unitType,
    room_leave: unitType, room_players: i32Type,
    room_on_player_join: unitType, room_on_player_leave: unitType,
    room_spectate: unitType, room_spectator_count: i32Type,
    net_sync_pos: unitType, net_sync_state: unitType,
    net_on_player_update: unitType, net_interpolate: f64Type,
    leaderboard_submit: unitType, leaderboard_get: unitType, leaderboard_rank: i32Type,
  });
}
