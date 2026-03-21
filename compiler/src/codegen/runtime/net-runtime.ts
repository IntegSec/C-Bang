/**
 * Networking runtime — WebSocket client, rooms, state sync.
 */
export const NET_RUNTIME = `
var __net = (function() {
  var ws = null;
  var playerId = '';
  var handlers = {};
  var connected = false;
  var latency = 0;
  var pingInterval = null;
  var lastPingTime = 0;
  var disconnectCallbacks = [];
  var reconnectUrl = '';
  var reconnectAttempts = 0;
  var maxReconnectAttempts = 15;
  var playerSnapshots = {};
  var INTERP_DELAY = 100;

  function send(type, data) {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: type, data: data }));
  }

  function handleMessage(msg) {
    var parsed = JSON.parse(msg.data);
    if (parsed.type === '__pong') {
      latency = Date.now() - lastPingTime;
      return;
    }
    if (parsed.type === '__assign_id') {
      playerId = parsed.data.id;
      return;
    }
    if (parsed.type === '__player_update') {
      var pid = parsed.data.player_id;
      if (!playerSnapshots[pid]) playerSnapshots[pid] = [];
      parsed.data.timestamp = Date.now();
      playerSnapshots[pid].push(parsed.data);
      if (playerSnapshots[pid].length > 10) playerSnapshots[pid].shift();
    }
    var cbs = handlers[parsed.type];
    if (cbs) { for (var i = 0; i < cbs.length; i++) cbs[i](parsed.data); }
  }

  function tryReconnect() {
    if (reconnectAttempts >= maxReconnectAttempts) return;
    reconnectAttempts++;
    setTimeout(function() {
      if (!connected && reconnectUrl) __net.connect(reconnectUrl);
    }, 2000);
  }

  var __net = {
    connect: function(url) {
      reconnectUrl = url;
      ws = new WebSocket(url);
      ws.onopen = function() { connected = true; reconnectAttempts = 0;
        pingInterval = setInterval(function() { lastPingTime = Date.now(); send('__ping', {}); }, 5000);
      };
      ws.onmessage = handleMessage;
      ws.onclose = function() {
        connected = false;
        if (pingInterval) clearInterval(pingInterval);
        for (var i = 0; i < disconnectCallbacks.length; i++) disconnectCallbacks[i]();
        tryReconnect();
      };
      ws.onerror = function() {};
    },
    disconnect: function() { reconnectUrl = ''; if (ws) ws.close(); },
    send: send,
    on: function(type, cb) { if (!handlers[type]) handlers[type] = []; handlers[type].push(cb); },
    onDisconnect: function(cb) { disconnectCallbacks.push(cb); },
    isConnected: function() { return connected; },
    latency: function() { return latency; },
    playerId: function() { return playerId; },

    roomCreate: function(mode, max) { send('room_create', { mode: mode, max_players: max }); },
    roomJoin: function(id) { send('room_join', { room_id: id }); },
    roomJoinRandom: function(mode) { send('room_join_random', { mode: mode }); },
    roomLeave: function() { send('room_leave', {}); },
    roomPlayers: function() { return 0; },
    roomOnPlayerJoin: function(cb) { __net.on('player_joined', cb); },
    roomOnPlayerLeave: function(cb) { __net.on('player_left', cb); },
    roomSpectate: function(id) { send('room_spectate', { room_id: id }); },
    roomSpectatorCount: function() { return 0; },

    syncPos: function(x, y) { send('sync_pos', { x: x, y: y }); },
    syncState: function(key, val) { send('sync_state', { key: key, value: val }); },
    onPlayerUpdate: function(cb) { __net.on('__player_update', cb); },
    interpolate: function(pid, prop) {
      var snaps = playerSnapshots[pid];
      if (!snaps || snaps.length < 2) return snaps && snaps.length === 1 ? (snaps[0][prop] || 0) : 0;
      var now = Date.now() - INTERP_DELAY;
      var a = snaps[snaps.length - 2], b = snaps[snaps.length - 1];
      var range = b.timestamp - a.timestamp;
      if (range <= 0) return b[prop] || 0;
      var t = Math.max(0, Math.min(1, (now - a.timestamp) / range));
      return (a[prop] || 0) + ((b[prop] || 0) - (a[prop] || 0)) * t;
    },

    leaderboardSubmit: function(score) { send('leaderboard_submit', { score: score }); },
    leaderboardGet: function(scope, count, cb) { send('leaderboard_get', { scope: scope, count: count }); __net.on('leaderboard_data', cb); },
    leaderboardRank: function() { return 0; },
  };
  return __net;
})();
`;
