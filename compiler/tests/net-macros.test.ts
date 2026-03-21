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

describe('networking macros', () => {
  it('net_connect maps to __net.connect', () => {
    const js = generate(`fn main() { net_connect!("ws://localhost:8080"); }`);
    expect(js).toContain('__net.connect("ws://localhost:8080")');
  });

  it('net_disconnect maps to __net.disconnect', () => {
    const js = generate(`fn main() { net_disconnect!(); }`);
    expect(js).toContain('__net.disconnect()');
  });

  it('net_send maps to __net.send', () => {
    const js = generate(`fn main() { net_send!("move", "data"); }`);
    expect(js).toContain('__net.send("move", "data")');
  });

  it('net_is_connected maps to __net.isConnected', () => {
    const js = generate(`fn main() { let c: bool = net_is_connected!(); }`);
    expect(js).toContain('__net.isConnected()');
  });

  it('net_latency maps to __net.latency', () => {
    const js = generate(`fn main() { let l: f64 = net_latency!(); }`);
    expect(js).toContain('__net.latency()');
  });

  it('net_player_id maps to __net.playerId', () => {
    const js = generate(`fn main() { let id: String = net_player_id!(); }`);
    expect(js).toContain('__net.playerId()');
  });

  it('net_on_disconnect maps to __net.onDisconnect', () => {
    const js = generate(`fn cb() {} fn main() { net_on_disconnect!(cb); }`);
    expect(js).toContain('__net.onDisconnect(cb)');
  });

  it('room_create maps to __net.roomCreate', () => {
    const js = generate(`fn main() { room_create!("competitive", 50); }`);
    expect(js).toContain('__net.roomCreate("competitive", 50)');
  });

  it('room_join_random maps to __net.roomJoinRandom', () => {
    const js = generate(`fn main() { room_join_random!("competitive"); }`);
    expect(js).toContain('__net.roomJoinRandom("competitive")');
  });

  it('room_spectate maps to __net.roomSpectate', () => {
    const js = generate(`fn main() { room_spectate!("room123"); }`);
    expect(js).toContain('__net.roomSpectate("room123")');
  });

  it('net_sync_pos maps to __net.syncPos', () => {
    const js = generate(`fn main() { net_sync_pos!(100.0, 200.0); }`);
    expect(js).toContain('__net.syncPos(100.0, 200.0)');
  });

  it('net_interpolate maps to __net.interpolate', () => {
    const js = generate(`fn main() { let x: f64 = net_interpolate!("p1", "x"); }`);
    expect(js).toContain('__net.interpolate("p1", "x")');
  });

  it('leaderboard_submit maps to __net.leaderboardSubmit', () => {
    const js = generate(`fn main() { leaderboard_submit!(1000); }`);
    expect(js).toContain('__net.leaderboardSubmit(1000)');
  });

  it('net_on maps to __net.on', () => {
    const js = generate(`fn cb(data: String) {} fn main() { net_on!("score_update", cb); }`);
    expect(js).toContain('__net.on("score_update", cb)');
  });

  it('room_join maps to __net.roomJoin', () => {
    const js = generate(`fn main() { room_join!("room123"); }`);
    expect(js).toContain('__net.roomJoin("room123")');
  });

  it('room_leave maps to __net.roomLeave', () => {
    const js = generate(`fn main() { room_leave!(); }`);
    expect(js).toContain('__net.roomLeave()');
  });

  it('room_players maps to __net.roomPlayers', () => {
    const js = generate(`fn main() { let n: i32 = room_players!(); }`);
    expect(js).toContain('__net.roomPlayers()');
  });

  it('room_on_player_join maps to __net.roomOnPlayerJoin', () => {
    const js = generate(`fn cb(data: String) {} fn main() { room_on_player_join!(cb); }`);
    expect(js).toContain('__net.roomOnPlayerJoin(cb)');
  });

  it('room_on_player_leave maps to __net.roomOnPlayerLeave', () => {
    const js = generate(`fn cb(data: String) {} fn main() { room_on_player_leave!(cb); }`);
    expect(js).toContain('__net.roomOnPlayerLeave(cb)');
  });

  it('room_spectator_count maps to __net.roomSpectatorCount', () => {
    const js = generate(`fn main() { let n: i32 = room_spectator_count!(); }`);
    expect(js).toContain('__net.roomSpectatorCount()');
  });

  it('net_sync_state maps to __net.syncState', () => {
    const js = generate(`fn main() { net_sync_state!("score", "100"); }`);
    expect(js).toContain('__net.syncState("score", "100")');
  });

  it('net_on_player_update maps to __net.onPlayerUpdate', () => {
    const js = generate(`fn cb(data: String) {} fn main() { net_on_player_update!(cb); }`);
    expect(js).toContain('__net.onPlayerUpdate(cb)');
  });

  it('leaderboard_get maps to __net.leaderboardGet', () => {
    const js = generate(`fn cb(data: String) {} fn main() { leaderboard_get!("global", 10, cb); }`);
    expect(js).toContain('__net.leaderboardGet("global", 10, cb)');
  });

  it('leaderboard_rank maps to __net.leaderboardRank', () => {
    const js = generate(`fn main() { let r: i32 = leaderboard_rank!(); }`);
    expect(js).toContain('__net.leaderboardRank()');
  });
});
