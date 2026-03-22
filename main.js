let px = 165.0;

let pw = 70.0;

let ph = 90.0;

let py = 400.0;

let pspeed = 450.0;

let frozen = false;

let freeze_timer = 0.0;

let wide_timer = 0.0;

let d_x0 = 80.0;

let d_y0 = 20.0;

let d_v0 = 1.0;

let d_wobble0 = 0.0;

let d_x1 = 180.0;

let d_y1 = 120.0;

let d_v1 = 1.0;

let d_wobble1 = 1.0;

let d_x2 = 280.0;

let d_y2 = 220.0;

let d_v2 = 2.0;

let d_wobble2 = 2.0;

let d_x3 = 50.0;

let d_y3 = 320.0;

let d_v3 = 1.0;

let d_wobble3 = 3.0;

let obs_x = 200.0;

let obs_y = -500.0;

let obs_active = false;

let obs_type = 0.0;

let pow_x = 150.0;

let pow_y = -800.0;

let pow_active = false;

let pow_type = 0.0;

let pow_spin = 0.0;

let score = 0.0;

let combo = 0.0;

let combo_timer = 0.0;

let max_combo = 0.0;

let fill = 10.0;

let lives = 5.0;

let level = 1.0;

let drop_speed = 180.0;

let anim_time = 0.0;

let best_score = 0.0;

let catches_total = 0.0;

let level_timer = 30.0;

let game_state = 0.0;

let go_delay = 0.0;

let pepper_rush = false;

let rush_timer = 0.0;

let shield = false;

let frenzy_active = false;

let frenzy_timer = 0.0;

let frenzy_cooldown = 30.0;

let frenzy_speed_mult = 1.0;

let fp_x0 = 0.0;

let fp_y0 = 0.0;

let fp_s0 = 0.0;

let fp_x1 = 0.0;

let fp_y1 = 0.0;

let fp_s1 = 0.0;

let fp_x2 = 0.0;

let fp_y2 = 0.0;

let fp_s2 = 0.0;

let fp_x3 = 0.0;

let fp_y3 = 0.0;

let fp_s3 = 0.0;

let fp_x4 = 0.0;

let fp_y4 = 0.0;

let fp_s4 = 0.0;

let fp_x5 = 0.0;

let fp_y5 = 0.0;

let fp_s5 = 0.0;

let fp_x6 = 0.0;

let fp_y6 = 0.0;

let fp_s6 = 0.0;

let fp_x7 = 0.0;

let fp_y7 = 0.0;

let fp_s7 = 0.0;

let fp_x8 = 0.0;

let fp_y8 = 0.0;

let fp_s8 = 0.0;

let fp_x9 = 0.0;

let fp_y9 = 0.0;

let fp_s9 = 0.0;

let fp_x10 = 0.0;

let fp_y10 = 0.0;

let fp_s10 = 0.0;

let fp_x11 = 0.0;

let fp_y11 = 0.0;

let fp_s11 = 0.0;

let near_miss_timer = 0.0;

let near_miss_x = 0.0;

let combo_broken_timer = 0.0;

let combo_broken_val = 0.0;

let sp_active = false;

let sp_timer = 0.0;

let sp_x = 0.0;

let sp_y = 0.0;

let sp_dx0 = 0.0;

let sp_dy0 = 0.0;

let sp_dx1 = 0.0;

let sp_dy1 = 0.0;

let sp_dx2 = 0.0;

let sp_dy2 = 0.0;

let sp_dx3 = 0.0;

let sp_dy3 = 0.0;

let sp_dx4 = 0.0;

let sp_dy4 = 0.0;

let sp_dx5 = 0.0;

let sp_dy5 = 0.0;

let sp_dx6 = 0.0;

let sp_dy6 = 0.0;

let sp_dx7 = 0.0;

let sp_dy7 = 0.0;

let sp_color = "#8b0000";

let shake = 0.0;

let combo_scale = 1.0;

let float_score_val = 0.0;

let float_score_x = 0.0;

let float_score_y = 0.0;

let float_score_timer = 0.0;

let jackpot_timer = 0.0;

let lucky_timer = 0.0;

let bonus_timer = 0.0;

let bonus_type = 0.0;

let double_pts_timer = 0.0;

let danger_pulse = 0.0;

let fake_catches = 47382.0;

let star_x0 = 45.0;

let star_y0 = 30.0;

let star_x1 = 120.0;

let star_y1 = 80.0;

let star_x2 = 230.0;

let star_y2 = 45.0;

let star_x3 = 310.0;

let star_y3 = 110.0;

let star_x4 = 70.0;

let star_y4 = 160.0;

let star_x5 = 350.0;

let star_y5 = 60.0;

let star_x6 = 25.0;

let star_y6 = 250.0;

let star_x7 = 280.0;

let star_y7 = 200.0;

let star_x8 = 160.0;

let star_y8 = 290.0;

let star_x9 = 95.0;

let star_y9 = 350.0;

let star_x10 = 340.0;

let star_y10 = 310.0;

let star_x11 = 200.0;

let star_y11 = 380.0;

let muted = false;

let style_sel = 0.0;

let level_complete_timer = 0.0;

let level_stars = 0.0;

let level_fill_snap = 0.0;

let audio_started = false;

let powerup_flash_timer = 0.0;

let powerup_flash_color = "#ffffff";

let xp_bar = 0.0;

let weapon_type = 0.0;

let weapon_timer = 0.0;

let fire_cooldown = 0.0;

let frozen_drops = false;

let frozen_drop_timer = 0.0;

let shield_burst = false;

let shield_burst_timer = 0.0;

let shield_burst_radius = 0.0;

let freeze_shot_used = false;

let l_x0 = 0.0;

let l_y0 = -50.0;

let l_active0 = false;

let l_ang0 = 0.0;

let l_x1 = 0.0;

let l_y1 = -50.0;

let l_active1 = false;

let l_ang1 = 0.0;

let l_x2 = 0.0;

let l_y2 = -50.0;

let l_active2 = false;

let l_ang2 = 0.0;

let mb_x = 0.0;

let mb_y = -50.0;

let mb_active = false;

let mb_radius = 20.0;

let wp_x = 0.0;

let wp_y = -1000.0;

let wp_active = false;

let wp_type = 0.0;

let wp_spawn_timer = 15.0;

let wp_spin = 0.0;

let hit_active = false;

let hit_timer = 0.0;

let hit_x = 0.0;

let hit_y = 0.0;

let hit_dx0 = 0.0;

let hit_dy0 = 0.0;

let hit_dx1 = 0.0;

let hit_dy1 = 0.0;

let hit_dx2 = 0.0;

let hit_dy2 = 0.0;

let hit_dx3 = 0.0;

let hit_dy3 = 0.0;

let hit_dx4 = 0.0;

let hit_dy4 = 0.0;

let hit_dx5 = 0.0;

let hit_dy5 = 0.0;

let freeze_tint_timer = 0.0;

let notif0_text = "";

let notif0_timer = 0.0;

let notif0_color = "#fff";

let notif1_text = "";

let notif1_timer = 0.0;

let notif1_color = "#fff";

let notif2_text = "";

let notif2_timer = 0.0;

let notif2_color = "#fff";

let notif3_text = "";

let notif3_timer = 0.0;

let notif3_color = "#fff";

function random_x() {
  return Math.floor(Math.random() * 340.0) + 20.0;
}

function random_value() {
  const r = Math.random();
  if (r < 0.02) {
    return 10.0;
  }
  if (r < 0.10) {
    return 5.0;
  }
  if (r < 0.30) {
    return 2.0;
  }
  return 1.0;
}

function drop_color(v) {
  if (v == 10.0) {
    return "#ffd700";
  }
  if (v == 5.0) {
    return "#ff6b35";
  }
  if (v == 2.0) {
    return "#c0392b";
  }
  return "#8b0000";
}

function combo_multiplier() {
  if (combo >= 20.0) {
    return 5.0;
  }
  if (combo >= 10.0) {
    return 3.0;
  }
  if (combo >= 5.0) {
    return 2.0;
  }
  return 1.0;
}

function abs_val(x) {
  if (x < 0.0) {
    return 0.0 - x;
  }
  return x;
}

function push_notif(text, color, duration) {
  if (notif0_timer <= 0.0) {
    notif0_text = text;
    notif0_color = color;
    notif0_timer = duration;
    return;
  }
  if (notif1_timer <= 0.0) {
    notif1_text = text;
    notif1_color = color;
    notif1_timer = duration;
    return;
  }
  if (notif2_timer <= 0.0) {
    notif2_text = text;
    notif2_color = color;
    notif2_timer = duration;
    return;
  }
  if (notif3_timer <= 0.0) {
    notif3_text = text;
    notif3_color = color;
    notif3_timer = duration;
    return;
  }
  notif3_text = text;
  notif3_color = color;
  notif3_timer = duration;
}

function draw_notifications(dt) {
  if (notif0_timer > 0.0) {
    notif0_timer = notif0_timer - dt;
    (() => { __ctx.fillStyle = notif0_color; })();
    (() => { __ctx.font = "bold 16px Arial"; })();
    __ctx.fillText(notif0_text, 120.0, 60.0);
    if (notif0_timer <= 0.0) {
      notif0_timer = 0.0;
      notif0_text = "";
    }
  }
  if (notif1_timer > 0.0) {
    notif1_timer = notif1_timer - dt;
    (() => { __ctx.fillStyle = notif1_color; })();
    (() => { __ctx.font = "bold 14px Arial"; })();
    __ctx.fillText(notif1_text, 120.0, 85.0);
    if (notif1_timer <= 0.0) {
      notif1_timer = 0.0;
      notif1_text = "";
    }
  }
  if (notif2_timer > 0.0) {
    notif2_timer = notif2_timer - dt;
    (() => { __ctx.fillStyle = notif2_color; })();
    (() => { __ctx.font = "bold 13px Arial"; })();
    __ctx.fillText(notif2_text, 120.0, 110.0);
    if (notif2_timer <= 0.0) {
      notif2_timer = 0.0;
      notif2_text = "";
    }
  }
  if (notif3_timer > 0.0) {
    notif3_timer = notif3_timer - dt;
    (() => { __ctx.fillStyle = notif3_color; })();
    (() => { __ctx.font = "bold 12px Arial"; })();
    __ctx.fillText(notif3_text, 120.0, 135.0);
    if (notif3_timer <= 0.0) {
      notif3_timer = 0.0;
      notif3_text = "";
    }
  }
}

function spawn_splash(sx, sy, col) {
  sp_active = true;
  sp_timer = 0.6;
  sp_x = sx;
  sp_y = sy;
  sp_color = col;
  sp_dx0 = (Math.random() - 0.5) * 250.0;
  sp_dy0 = 0.0 - Math.random() * 300.0;
  sp_dx1 = (Math.random() - 0.5) * 250.0;
  sp_dy1 = 0.0 - Math.random() * 300.0;
  sp_dx2 = (Math.random() - 0.5) * 250.0;
  sp_dy2 = 0.0 - Math.random() * 300.0;
  sp_dx3 = (Math.random() - 0.5) * 250.0;
  sp_dy3 = 0.0 - Math.random() * 300.0;
  sp_dx4 = (Math.random() - 0.5) * 250.0;
  sp_dy4 = 0.0 - Math.random() * 300.0;
  sp_dx5 = (Math.random() - 0.5) * 250.0;
  sp_dy5 = 0.0 - Math.random() * 300.0;
  sp_dx6 = (Math.random() - 0.5) * 250.0;
  sp_dy6 = 0.0 - Math.random() * 300.0;
  sp_dx7 = (Math.random() - 0.5) * 250.0;
  sp_dy7 = 0.0 - Math.random() * 300.0;
}

function spawn_hit_explosion(hx, hy) {
  hit_active = true;
  hit_timer = 0.4;
  hit_x = hx;
  hit_y = hy;
  hit_dx0 = (Math.random() - 0.5) * 300.0;
  hit_dy0 = (Math.random() - 0.5) * 300.0;
  hit_dx1 = (Math.random() - 0.5) * 300.0;
  hit_dy1 = (Math.random() - 0.5) * 300.0;
  hit_dx2 = (Math.random() - 0.5) * 300.0;
  hit_dy2 = (Math.random() - 0.5) * 300.0;
  hit_dx3 = (Math.random() - 0.5) * 300.0;
  hit_dy3 = (Math.random() - 0.5) * 300.0;
  hit_dx4 = (Math.random() - 0.5) * 300.0;
  hit_dy4 = (Math.random() - 0.5) * 300.0;
  hit_dx5 = (Math.random() - 0.5) * 300.0;
  hit_dy5 = (Math.random() - 0.5) * 300.0;
}

function draw_hit_explosion() {
  if (hit_active == false) {
    return;
  }
  const life = hit_timer / 0.4;
  const t = 0.4 - hit_timer;
  const psize = 4.0 * life + 0.5;
  if (t < 0.1) {
    (() => { __ctx.fillStyle = "rgba(255,255,200,0.8)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(hit_x, hit_y, 12.0 * life, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  (() => { __ctx.fillStyle = "rgba(255,100,50,0.8)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx0 * t, hit_y + hit_dy0 * t, psize, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx1 * t, hit_y + hit_dy1 * t, psize * 0.8, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx2 * t, hit_y + hit_dy2 * t, psize, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,200,50,0.7)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx3 * t, hit_y + hit_dy3 * t, psize * 0.7, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx4 * t, hit_y + hit_dy4 * t, psize * 0.9, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hit_x + hit_dx5 * t, hit_y + hit_dy5 * t, psize * 0.6, 0, 2 * Math.PI); __ctx.fill(); })();
}

function weapon_name(wt) {
  if (wt == 1.0) {
    return "SPREAD";
  }
  if (wt == 2.0) {
    return "MEGA BLAST";
  }
  if (wt == 3.0) {
    return "FREEZE RAY";
  }
  if (wt == 4.0) {
    return "SHIELD BURST";
  }
  return "LASER";
}

function weapon_color(wt) {
  if (wt == 1.0) {
    return "#00ffff";
  }
  if (wt == 2.0) {
    return "#ffff00";
  }
  if (wt == 3.0) {
    return "#4488ff";
  }
  if (wt == 4.0) {
    return "#44ff44";
  }
  return "#ff3333";
}

function weapon_letter(wt) {
  if (wt == 1.0) {
    return "3";
  }
  if (wt == 2.0) {
    return "B";
  }
  if (wt == 3.0) {
    return "F";
  }
  if (wt == 4.0) {
    return "S";
  }
  return "L";
}

function draw_weapon_pickup(wpx, wpy, wtype, wspin) {
  const size = 28.0;
  const wcx = wpx + size / 2.0;
  const wcy = wpy + size / 2.0;
  (() => { __ctx.fillStyle = "rgba(0,255,255,0.2)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(wcx, wcy, size * 0.9, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.save();
  __ctx.translate(wcx, wcy);
  __ctx.rotate(wspin);
  __ctx.beginPath();
  __ctx.moveTo(0.0, -14.0);
  __ctx.lineTo(14.0, 0.0);
  __ctx.lineTo(0.0, 14.0);
  __ctx.lineTo(-14.0, 0.0);
  __ctx.closePath();
  (() => { __ctx.fillStyle = "#00ffff"; })();
  __ctx.fill();
  (() => { __ctx.fillStyle = "#003333"; })();
  (() => { __ctx.beginPath(); __ctx.arc(0.0, 0.0, 7.0, 0, 2 * Math.PI); __ctx.fill(); })();
  let wletter = weapon_letter(wtype + 1.0);
  let wcolor = weapon_color(wtype + 1.0);
  (() => { __ctx.fillStyle = wcolor; })();
  (() => { __ctx.font = "bold 10px Arial"; })();
  __ctx.fillText(wletter, -4.0, 4.0);
  __ctx.restore();
}

function draw_laser_beam(lx, ly, lang) {
  (() => { __ctx.fillStyle = "rgba(255,50,50,0.2)"; })();
  const glow_w = 10.0;
  const beam_len = 20.0;
  const dir_x = Math.sin(lang);
  const dir_y = 0.0 - Math.cos(lang);
  (() => { __ctx.beginPath(); __ctx.arc(lx, ly, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(lx + dir_x * 5.0, ly + dir_y * 5.0, 5.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(lx - dir_x * 5.0, ly - dir_y * 5.0, 5.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#ff3333"; })();
  (() => { __ctx.beginPath(); __ctx.arc(lx, ly, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(lx + dir_x * 5.0, ly + dir_y * 5.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(lx - dir_x * 5.0, ly - dir_y * 5.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#ff8888"; })();
  (() => { __ctx.beginPath(); __ctx.arc(lx, ly, 1.5, 0, 2 * Math.PI); __ctx.fill(); })();
}

function draw_mega_blast(mx, my, mr) {
  (() => { __ctx.fillStyle = "rgba(255,255,0,0.15)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(mx, my, mr + 10.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,200,0,0.7)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(mx, my, mr, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,200,0.8)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(mx, my, mr * 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#ffffff"; })();
  (() => { __ctx.beginPath(); __ctx.arc(mx, my, mr * 0.2, 0, 2 * Math.PI); __ctx.fill(); })();
}

function draw_shield_burst_ring(scx, scy, sr) {
  const ring_alpha = 1.0 - sr / 150.0;
  if (ring_alpha > 0.0) {
    (() => { __ctx.strokeStyle = "rgba(0,255,100,0.6)"; })();
    (() => { __ctx.lineWidth = 3.0; })();
    (() => { __ctx.fillStyle = "rgba(0,255,100,0.3)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(scx + sr, scy, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx - sr, scy, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx, scy + sr, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx, scy - sr, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx + sr * 0.707, scy + sr * 0.707, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx - sr * 0.707, scy + sr * 0.707, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx + sr * 0.707, scy - sr * 0.707, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(scx - sr * 0.707, scy - sr * 0.707, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.fillStyle = "rgba(0,255,100,0.05)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(scx, scy, sr, 0, 2 * Math.PI); __ctx.fill(); })();
  }
}

function draw_weapon_hud() {
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.6)"; })();
  __ctx.fillRect(0.0, 460.0, 120.0, 30.0);
  const wname = weapon_name(weapon_type);
  const wcolor = weapon_color(weapon_type);
  (() => { __ctx.fillStyle = wcolor; })();
  (() => { __ctx.font = "bold 10px Arial"; })();
  __ctx.fillText(wname, 25.0, 478.0);
  (() => { __ctx.fillStyle = wcolor; })();
  __ctx.fillRect(5.0, 466.0, 16.0, 16.0);
  (() => { __ctx.fillStyle = "#000000"; })();
  (() => { __ctx.font = "bold 9px Arial"; })();
  const wletter = weapon_letter(weapon_type);
  __ctx.fillText(wletter, 8.0, 478.0);
  if (weapon_type > 0.0) {
    if (weapon_timer > 0.0) {
      const bar_pct = weapon_timer / 15.0;
      (() => { __ctx.fillStyle = "rgba(255,255,255,0.2)"; })();
      __ctx.fillRect(5.0, 484.0, 110.0, 4.0);
      (() => { __ctx.fillStyle = wcolor; })();
      __ctx.fillRect(5.0, 484.0, 110.0 * bar_pct, 4.0);
    }
  }
}

function fire_laser(fx, fy, fang) {
  if (l_active0 == false) {
    l_x0 = fx;
    l_y0 = fy;
    l_ang0 = fang;
    l_active0 = true;
    return;
  }
  if (l_active1 == false) {
    l_x1 = fx;
    l_y1 = fy;
    l_ang1 = fang;
    l_active1 = true;
    return;
  }
  if (l_active2 == false) {
    l_x2 = fx;
    l_y2 = fy;
    l_ang2 = fang;
    l_active2 = true;
    return;
  }
}

function check_laser_hit_drop(lx, ly, dx, dy) {
  let dist_x = lx - dx;
  let dist_y = ly - dy;
  if (dist_x < 0.0) {
    dist_x = 0.0 - dist_x;
  }
  if (dist_y < 0.0) {
    dist_y = 0.0 - dist_y;
  }
  if (dist_x < 15.0) {
    if (dist_y < 15.0) {
      return true;
    }
  }
  return false;
}

function check_mega_hit(mx, my, dx, dy) {
  let dist_x = mx - dx;
  let dist_y = my - dy;
  if (dist_x < 0.0) {
    dist_x = 0.0 - dist_x;
  }
  if (dist_y < 0.0) {
    dist_y = 0.0 - dist_y;
  }
  if (dist_x < 40.0) {
    if (dist_y < 40.0) {
      return true;
    }
  }
  return false;
}

function draw_teardrop(dx, dy, size, color, is_golden) {
  const radius = size / 2.0;
  if (is_golden) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.25)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(dx, dy + radius * 0.5, size * 1.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.15)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(dx, dy + radius * 0.5, size * 2.2, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  (() => { __ctx.fillStyle = color; })();
  (() => { __ctx.beginPath(); __ctx.arc(dx, dy + radius, radius, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(dx, dy - radius * 1.2);
  __ctx.lineTo(dx - radius, dy + radius * 0.3);
  __ctx.lineTo(dx + radius, dy + radius * 0.3);
  __ctx.closePath();
  __ctx.fill();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.35)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(dx - radius * 0.25, dy + radius * 0.3, radius * 0.35, 0, 2 * Math.PI); __ctx.fill(); })();
}

function draw_drop_trail(dx, dy, color) {
  (() => { __ctx.fillStyle = "rgba(139,0,0,0.15)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(dx, dy - 12.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(139,0,0,0.08)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(dx, dy - 22.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(139,0,0,0.03)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(dx, dy - 30.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
}

function draw_dr_pepper_can(cx, cy, cw, ch, is_frozen, is_rush, has_shield) {
  const half_w = cw / 2.0;
  const center_x = cx + half_w;
  const rim_h = 10.0;
  const body_top = cy + rim_h;
  const body_h = ch - rim_h - 8.0;
  const bottom_y = cy + ch - 8.0;
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.35)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, cy + ch + 3.0, half_w * 0.85, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.15)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, cy + ch + 5.0, half_w * 1.1, 0, 2 * Math.PI); __ctx.fill(); })();
  if (is_rush) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.15)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(center_x, cy + ch / 2.0, half_w * 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.fillStyle = "rgba(255,200,0,0.08)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(center_x, cy + ch / 2.0, half_w * 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  (() => { __ctx.fillStyle = "rgba(30,0,8,0.9)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, bottom_y + 2.0, half_w, 0, 2 * Math.PI); __ctx.fill(); })();
  let body_base = "#4a0012";
  if (is_frozen) {
    body_base = "#2a5a6e";
  }
  if (is_rush) {
    body_base = "#6e4a00";
  }
  (() => { __ctx.fillStyle = body_base; })();
  __ctx.fillRect(cx, body_top, cw, body_h);
  let highlight_left = "rgba(120,20,40,0.5)";
  if (is_frozen) {
    highlight_left = "rgba(80,160,200,0.4)";
  }
  if (is_rush) {
    highlight_left = "rgba(200,170,50,0.4)";
  }
  (() => { __ctx.fillStyle = highlight_left; })();
  __ctx.fillRect(cx, body_top, 8.0, body_h);
  let highlight_left2 = "rgba(150,40,60,0.3)";
  if (is_frozen) {
    highlight_left2 = "rgba(100,190,220,0.25)";
  }
  if (is_rush) {
    highlight_left2 = "rgba(220,190,80,0.25)";
  }
  (() => { __ctx.fillStyle = highlight_left2; })();
  __ctx.fillRect(cx + 8.0, body_top, 4.0, body_h);
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.2)"; })();
  __ctx.fillRect(cx + cw - 6.0, body_top, 6.0, body_h);
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.1)"; })();
  __ctx.fillRect(cx + cw - 12.0, body_top, 6.0, body_h);
  let top_ellipse_col = "#5a0018";
  if (is_frozen) {
    top_ellipse_col = "#3a7a90";
  }
  if (is_rush) {
    top_ellipse_col = "#8a6a10";
  }
  (() => { __ctx.fillStyle = top_ellipse_col; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, body_top + 2.0, half_w, 0, 2 * Math.PI); __ctx.fill(); })();
  let bot_ellipse_col = "#3a0010";
  if (is_frozen) {
    bot_ellipse_col = "#1a4a5e";
  }
  if (is_rush) {
    bot_ellipse_col = "#5a3a00";
  }
  (() => { __ctx.fillStyle = bot_ellipse_col; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, bottom_y, half_w, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(80,80,80,0.6)"; })();
  __ctx.fillRect(cx + 3.0, bottom_y - 1.0, cw - 6.0, 4.0);
  (() => { __ctx.fillStyle = "rgba(120,120,120,0.4)"; })();
  __ctx.fillRect(cx + 5.0, bottom_y - 1.0, cw - 10.0, 2.0);
  (() => { __ctx.fillStyle = "#888888"; })();
  __ctx.fillRect(cx + 4.0, cy, cw - 8.0, rim_h);
  (() => { __ctx.fillStyle = "#bbbbbb"; })();
  __ctx.fillRect(cx + 6.0, cy + 1.0, cw - 12.0, 4.0);
  (() => { __ctx.fillStyle = "#cccccc"; })();
  __ctx.fillRect(cx + 8.0, cy + 1.0, cw - 16.0, 2.0);
  (() => { __ctx.fillStyle = "#777777"; })();
  __ctx.fillRect(cx + 5.0, cy + rim_h - 3.0, cw - 10.0, 3.0);
  (() => { __ctx.fillStyle = "#aaaaaa"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x, cy + 3.0, half_w * 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#999999"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x + 5.0, cy + 2.0, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#bbbbbb"; })();
  (() => { __ctx.beginPath(); __ctx.arc(center_x + 5.0, cy + 1.5, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#888888"; })();
  __ctx.fillRect(center_x + 2.0, cy - 1.0, 8.0, 2.0);
  let label_bg = "#6a0020";
  if (is_frozen) {
    label_bg = "#4a8aa0";
  }
  if (is_rush) {
    label_bg = "#9a7a20";
  }
  (() => { __ctx.fillStyle = label_bg; })();
  __ctx.fillRect(cx + 2.0, cy + 20.0, cw - 4.0, 50.0);
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.15)"; })();
  __ctx.fillRect(cx + 2.0, cy + 20.0, cw - 4.0, 1.0);
  __ctx.fillRect(cx + 2.0, cy + 69.0, cw - 4.0, 1.0);
  const pep_cx = center_x;
  const pep_cy = cy + 48.0;
  (() => { __ctx.fillStyle = "#cc2200"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 6.0, pep_cy, 7.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + 6.0, pep_cy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.fillRect(pep_cx - 6.0, pep_cy - 7.0, 12.0, 14.0);
  (() => { __ctx.fillStyle = "#aa1800"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + 10.0, pep_cy + 1.0, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + 14.0, pep_cy + 2.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "#228b22"; })();
  __ctx.fillRect(pep_cx - 4.0, pep_cy - 12.0, 3.0, 8.0);
  (() => { __ctx.fillStyle = "#2ca02c"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 3.0, pep_cy - 12.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.25)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 4.0, pep_cy - 3.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  const flame_t = anim_time * 6.0;
  const f_off1 = Math.sin(flame_t) * 3.0;
  const f_off2 = Math.sin(flame_t + 1.5) * 2.5;
  const f_off3 = Math.sin(flame_t + 3.0) * 2.0;
  (() => { __ctx.fillStyle = "rgba(255,100,0,0.7)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + f_off1, pep_cy - 16.0, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 3.0 + f_off2, pep_cy - 20.0, 5.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,200,0,0.8)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + f_off2, pep_cy - 14.0, 4.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + 2.0 + f_off3, pep_cy - 18.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,200,0.6)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + f_off3, pep_cy - 13.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(200,0,0,0.4)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + 5.0 + f_off1, pep_cy - 12.0, 3.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 5.0 + f_off2, pep_cy - 14.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,220,0,0.5)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx + f_off1 * 2.0, pep_cy - 24.0 + f_off3, 1.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(pep_cx - 4.0 + f_off3, pep_cy - 22.0 + f_off1, 1.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.8)"; })();
  (() => { __ctx.font = "bold 9px Arial"; })();
  __ctx.fillText("Dr P", center_x - 12.0, cy + 66.0);
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.06)"; })();
  __ctx.fillRect(cx + 14.0, body_top, 3.0, body_h);
  if (is_frozen) {
    (() => { __ctx.fillStyle = "rgba(80,180,255,0.2)"; })();
    __ctx.fillRect(cx, body_top, cw, body_h);
    (() => { __ctx.fillStyle = "rgba(200,240,255,0.5)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(cx + 10.0, cy + 20.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(cx + cw - 12.0, cy + 30.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(cx + 15.0, cy + 60.0, 1.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(cx + cw - 8.0, cy + 70.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  if (has_shield) {
    (() => { __ctx.strokeStyle = "rgba(155,89,182,0.85)"; })();
    (() => { __ctx.lineWidth = 3.0; })();
    const hex_cx = center_x;
    const hex_cy = cy + ch / 2.0;
    const hex_r = half_w + 12.0;
    __ctx.beginPath();
    __ctx.moveTo(hex_cx + hex_r, hex_cy);
    __ctx.lineTo(hex_cx + hex_r * 0.5, hex_cy - hex_r * 0.866);
    __ctx.lineTo(hex_cx - hex_r * 0.5, hex_cy - hex_r * 0.866);
    __ctx.lineTo(hex_cx - hex_r, hex_cy);
    __ctx.lineTo(hex_cx - hex_r * 0.5, hex_cy + hex_r * 0.866);
    __ctx.lineTo(hex_cx + hex_r * 0.5, hex_cy + hex_r * 0.866);
    __ctx.closePath();
    __ctx.stroke();
    (() => { __ctx.fillStyle = "rgba(155,89,182,0.08)"; })();
    __ctx.fill();
  }
}

function draw_fill_meter(fill_pct) {
  const mx = 370.0;
  const my = 60.0;
  const mw = 24.0;
  const mh = 180.0;
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.4)"; })();
  __ctx.fillRect(mx + 1.0, my + 1.0, mw, mh);
  (() => { __ctx.fillStyle = "#2a0008"; })();
  __ctx.fillRect(mx, my, mw, mh);
  (() => { __ctx.beginPath(); __ctx.arc(mx + 12.0, my + 3.0, 12.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(mx + 12.0, my + mh - 3.0, 12.0, 0, 2 * Math.PI); __ctx.fill(); })();
  const fill_h = fill_pct * mh / 100.0;
  const fill_top = my + mh - fill_h;
  let liq_color = "#8b0023";
  if (fill_pct > 40.0) {
    liq_color = "#a01030";
  }
  if (fill_pct > 70.0) {
    liq_color = "#c01040";
  }
  if (fill_pct > 90.0) {
    liq_color = "#e02050";
  }
  (() => { __ctx.fillStyle = liq_color; })();
  __ctx.fillRect(mx + 2.0, fill_top, mw - 4.0, fill_h);
  if (fill_h > 5.0) {
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.2)"; })();
    __ctx.fillRect(mx + 2.0, fill_top, mw - 4.0, 3.0);
  }
  if (fill_h > 20.0) {
    const bub_off = Math.sin(anim_time * 5.0) * 8.0;
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.2)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(mx + 8.0, fill_top + fill_h * 0.3 + bub_off, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(mx + 16.0, fill_top + fill_h * 0.5 - bub_off, 1.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(mx + 11.0, fill_top + fill_h * 0.7 + bub_off * 0.5, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(mx + 14.0, fill_top + fill_h * 0.15 - bub_off * 0.7, 1.8, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  (() => { __ctx.fillStyle = "#c0c0c0"; })();
  __ctx.fillRect(mx + 3.0, my, mw - 6.0, 5.0);
  (() => { __ctx.fillStyle = "#e0e0e0"; })();
  __ctx.fillRect(mx + 5.0, my + 1.0, mw - 10.0, 2.0);
  (() => { __ctx.fillStyle = "#909090"; })();
  __ctx.fillRect(mx + 2.0, my + mh - 3.0, mw - 4.0, 3.0);
  __ctx.save();
  __ctx.translate(mx + 12.0, my + mh / 2.0);
  __ctx.rotate(0.0 - 1.5708);
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
  (() => { __ctx.font = "bold 8px Arial"; })();
  __ctx.fillText("Dr Pepper", -25.0, 4.0);
  __ctx.restore();
  const pct_display = Math.floor(fill_pct);
  (() => { __ctx.fillStyle = "#ffffff"; })();
  (() => { __ctx.font = "bold 10px Arial"; })();
  __ctx.fillText(`${pct_display}%`, mx + 2.0, my + mh + 14.0);
}

function draw_background() {
  (() => { __ctx.fillStyle = "#0f0008"; })();
  __ctx.fillRect(0.0, 0.0, 400.0, 100.0);
  (() => { __ctx.fillStyle = "#120010"; })();
  __ctx.fillRect(0.0, 100.0, 400.0, 100.0);
  (() => { __ctx.fillStyle = "#150018"; })();
  __ctx.fillRect(0.0, 200.0, 400.0, 100.0);
  (() => { __ctx.fillStyle = "#180020"; })();
  __ctx.fillRect(0.0, 300.0, 400.0, 100.0);
  (() => { __ctx.fillStyle = "#1b0028"; })();
  __ctx.fillRect(0.0, 400.0, 400.0, 100.0);
  const twinkle = Math.sin(anim_time * 3.0) * 0.3 + 0.5;
  const twinkle2 = Math.sin(anim_time * 4.5 + 1.0) * 0.3 + 0.5;
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x0, star_y0, 1.2 * twinkle + 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x2, star_y2, 1.0 * twinkle2 + 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x4, star_y4, 1.5 * twinkle + 0.3, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x5, star_y5, 1.0 * twinkle2 + 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x7, star_y7, 1.3 * twinkle + 0.3, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x9, star_y9, 1.0 * twinkle2 + 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.3)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x1, star_y1, 1.0 * twinkle2 + 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x3, star_y3, 1.5 * twinkle + 0.3, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x6, star_y6, 1.2 * twinkle2 + 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x8, star_y8, 1.0 * twinkle + 0.5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x10, star_y10, 1.3 * twinkle2 + 0.3, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(star_x11, star_y11, 1.0 * twinkle + 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  if (lives == 1.0) {
    if (game_state == 1.0) {
      const dtint = Math.sin(anim_time * 6.0) * 0.04 + 0.04;
      (() => { __ctx.fillStyle = "rgba(255,0,0,0.06)"; })();
      __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
    }
  }
}

function draw_obstacle(ox, oy, otype) {
  const size = 26.0;
  const ocx = ox + size / 2.0;
  const ocy = oy + size / 2.0;
  (() => { __ctx.fillStyle = "rgba(255,80,80,0.2)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(ocx, ocy, size * 0.9, 0, 2 * Math.PI); __ctx.fill(); })();
  if (otype == 0.0) {
    (() => { __ctx.fillStyle = "#4fc3f7"; })();
    (() => { __ctx.beginPath(); __ctx.arc(ocx, ocy + 3.0, 8.0, 0, 2 * Math.PI); __ctx.fill(); })();
    __ctx.beginPath();
    __ctx.moveTo(ocx, ocy - 10.0);
    __ctx.lineTo(ocx - 7.0, ocy + 1.0);
    __ctx.lineTo(ocx + 7.0, ocy + 1.0);
    __ctx.closePath();
    __ctx.fill();
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 8px Arial"; })();
    __ctx.fillText("W", ocx - 4.0, ocy + 5.0);
  }
  if (otype == 1.0) {
    (() => { __ctx.fillStyle = "#81d4fa"; })();
    (() => { __ctx.beginPath(); __ctx.arc(ocx, ocy, 10.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.fillStyle = "#b3e5fc"; })();
    (() => { __ctx.beginPath(); __ctx.arc(ocx, ocy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 12px Arial"; })();
    __ctx.fillText("F", ocx - 4.0, ocy + 5.0);
  }
  if (otype == 2.0) {
    (() => { __ctx.fillStyle = "#555"; })();
    __ctx.fillRect(ox + 3.0, oy + 2.0, 20.0, 22.0);
    (() => { __ctx.fillStyle = "#888"; })();
    __ctx.fillRect(ox + 6.0, oy, 14.0, 4.0);
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 7px Arial"; })();
    __ctx.fillText("RIVAL", ox + 4.0, oy + 16.0);
  }
}

function draw_powerup(ppx, ppy, ptype, spin) {
  const size = 28.0;
  const pcx = ppx + size / 2.0;
  const pcy = ppy + size / 2.0;
  if (ptype == 0.0) {
    (() => { __ctx.fillStyle = "rgba(46,204,113,0.25)"; })();
  }
  if (ptype == 1.0) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.3)"; })();
  }
  if (ptype == 2.0) {
    (() => { __ctx.fillStyle = "rgba(155,89,182,0.25)"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(pcx, pcy, size * 0.8, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.save();
  __ctx.translate(pcx, pcy);
  __ctx.rotate(spin);
  __ctx.beginPath();
  __ctx.moveTo(0.0, -12.0);
  __ctx.lineTo(12.0, 0.0);
  __ctx.lineTo(0.0, 12.0);
  __ctx.lineTo(-12.0, 0.0);
  __ctx.closePath();
  if (ptype == 0.0) {
    (() => { __ctx.fillStyle = "#2ecc71"; })();
  }
  if (ptype == 1.0) {
    (() => { __ctx.fillStyle = "#ffd700"; })();
  }
  if (ptype == 2.0) {
    (() => { __ctx.fillStyle = "#9b59b6"; })();
  }
  __ctx.fill();
  (() => { __ctx.fillStyle = "#fff"; })();
  (() => { __ctx.beginPath(); __ctx.arc(0.0, 0.0, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  if (ptype == 0.0) {
    (() => { __ctx.fillStyle = "#2ecc71"; })();
    (() => { __ctx.font = "bold 9px Arial"; })();
    __ctx.fillText("W", -4.0, 4.0);
  }
  if (ptype == 1.0) {
    (() => { __ctx.fillStyle = "#c9a832"; })();
    (() => { __ctx.font = "bold 9px Arial"; })();
    __ctx.fillText("$", -4.0, 4.0);
  }
  if (ptype == 2.0) {
    (() => { __ctx.fillStyle = "#9b59b6"; })();
    (() => { __ctx.font = "bold 8px Arial"; })();
    __ctx.fillText("S", -3.0, 4.0);
  }
  __ctx.restore();
}

function draw_splash_particles() {
  if (sp_active == false) {
    return;
  }
  const life = sp_timer / 0.6;
  const t = 0.6 - sp_timer;
  const grav = t * t * 300.0;
  const psize = 3.0 * life + 1.0;
  (() => { __ctx.fillStyle = sp_color; })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx0 * t, sp_y + sp_dy0 * t + grav, psize, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx1 * t, sp_y + sp_dy1 * t + grav, psize * 0.8, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx2 * t, sp_y + sp_dy2 * t + grav, psize, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx3 * t, sp_y + sp_dy3 * t + grav, psize * 0.7, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx4 * t, sp_y + sp_dy4 * t + grav, psize * 0.9, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx5 * t, sp_y + sp_dy5 * t + grav, psize * 0.6, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx6 * t, sp_y + sp_dy6 * t + grav, psize * 0.85, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx7 * t, sp_y + sp_dy7 * t + grav, psize * 0.75, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx0 * t, sp_y + sp_dy0 * t + grav, psize * 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx2 * t, sp_y + sp_dy2 * t + grav, psize * 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx4 * t, sp_y + sp_dy4 * t + grav, psize * 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(sp_x + sp_dx6 * t, sp_y + sp_dy6 * t + grav, psize * 0.4, 0, 2 * Math.PI); __ctx.fill(); })();
}

function draw_hearts() {
  const hx = 140.0;
  const hy = 14.0;
  const spacing = 22.0;
  let i = 0.0;
  if (lives >= 1.0) {
    (() => { __ctx.fillStyle = "#ff3333"; })();
  } else {
    (() => { __ctx.strokeStyle = "#553333"; })();
    (() => { __ctx.lineWidth = 1.5; })();
    (() => { __ctx.fillStyle = "rgba(0,0,0,0)"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(hx, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hx + 10.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(hx - 6.0, hy + 2.0);
  __ctx.lineTo(hx + 5.0, hy + 14.0);
  __ctx.lineTo(hx + 16.0, hy + 2.0);
  __ctx.closePath();
  __ctx.fill();
  if (lives >= 2.0) {
    (() => { __ctx.fillStyle = "#ff3333"; })();
  } else {
    (() => { __ctx.fillStyle = "#331111"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing + 10.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(hx + spacing - 6.0, hy + 2.0);
  __ctx.lineTo(hx + spacing + 5.0, hy + 14.0);
  __ctx.lineTo(hx + spacing + 16.0, hy + 2.0);
  __ctx.closePath();
  __ctx.fill();
  if (lives >= 3.0) {
    (() => { __ctx.fillStyle = "#ff3333"; })();
  } else {
    (() => { __ctx.fillStyle = "#331111"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 2.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 2.0 + 10.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(hx + spacing * 2.0 - 6.0, hy + 2.0);
  __ctx.lineTo(hx + spacing * 2.0 + 5.0, hy + 14.0);
  __ctx.lineTo(hx + spacing * 2.0 + 16.0, hy + 2.0);
  __ctx.closePath();
  __ctx.fill();
  if (lives >= 4.0) {
    (() => { __ctx.fillStyle = "#ff3333"; })();
  } else {
    (() => { __ctx.fillStyle = "#331111"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 3.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 3.0 + 10.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(hx + spacing * 3.0 - 6.0, hy + 2.0);
  __ctx.lineTo(hx + spacing * 3.0 + 5.0, hy + 14.0);
  __ctx.lineTo(hx + spacing * 3.0 + 16.0, hy + 2.0);
  __ctx.closePath();
  __ctx.fill();
  if (lives >= 5.0) {
    (() => { __ctx.fillStyle = "#ff3333"; })();
  } else {
    (() => { __ctx.fillStyle = "#331111"; })();
  }
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 4.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(hx + spacing * 4.0 + 10.0, hy, 6.0, 0, 2 * Math.PI); __ctx.fill(); })();
  __ctx.beginPath();
  __ctx.moveTo(hx + spacing * 4.0 - 6.0, hy + 2.0);
  __ctx.lineTo(hx + spacing * 4.0 + 5.0, hy + 14.0);
  __ctx.lineTo(hx + spacing * 4.0 + 16.0, hy + 2.0);
  __ctx.closePath();
  __ctx.fill();
  if (lives == 1.0) {
    const flash = Math.sin(anim_time * 8.0);
    if (flash > 0.0) {
      (() => { __ctx.fillStyle = "rgba(255,0,0,0.4)"; })();
      (() => { __ctx.beginPath(); __ctx.arc(hx, hy, 8.0, 0, 2 * Math.PI); __ctx.fill(); })();
    }
  }
}

function reset_game() {
  score = 0.0;
  combo = 0.0;
  max_combo = 0.0;
  fill = 10.0;
  lives = 5.0;
  level = 1.0;
  drop_speed = 180.0;
  pepper_rush = false;
  shield = false;
  frozen = false;
  pw = 70.0;
  go_delay = 0.0;
  catches_total = 0.0;
  level_timer = 30.0;
  double_pts_timer = 0.0;
  bonus_timer = 0.0;
  combo_broken_timer = 0.0;
  jackpot_timer = 0.0;
  lucky_timer = 0.0;
  float_score_timer = 0.0;
  powerup_flash_timer = 0.0;
  xp_bar = 0.0;
  d_x0 = random_x();
  d_y0 = 20.0;
  d_v0 = random_value();
  d_x1 = random_x();
  d_y1 = 120.0;
  d_v1 = random_value();
  d_x2 = random_x();
  d_y2 = 220.0;
  d_v2 = random_value();
  d_x3 = random_x();
  d_y3 = 320.0;
  d_v3 = random_value();
  obs_y = -500.0;
  obs_active = false;
  pow_y = -800.0;
  pow_active = false;
  sp_active = false;
  px = 165.0;
  level_complete_timer = 0.0;
  near_miss_timer = 0.0;
  shake = 0.0;
  weapon_type = 0.0;
  weapon_timer = 0.0;
  fire_cooldown = 0.0;
  frozen_drops = false;
  frozen_drop_timer = 0.0;
  shield_burst = false;
  shield_burst_timer = 0.0;
  shield_burst_radius = 0.0;
  freeze_shot_used = false;
  l_active0 = false;
  l_active1 = false;
  l_active2 = false;
  l_y0 = -50.0;
  l_y1 = -50.0;
  l_y2 = -50.0;
  mb_active = false;
  mb_y = -50.0;
  wp_active = false;
  wp_y = -1000.0;
  wp_spawn_timer = 15.0;
  hit_active = false;
  freeze_tint_timer = 0.0;
  combo_timer = 0.0;
  wide_timer = 0.0;
  freeze_timer = 0.0;
  rush_timer = 0.0;
  danger_pulse = 0.0;
  frenzy_active = false;
  frenzy_timer = 0.0;
  frenzy_cooldown = 30.0;
  frenzy_speed_mult = 1.0;
  notif0_timer = 0.0;
  notif1_timer = 0.0;
  notif2_timer = 0.0;
  notif3_timer = 0.0;
  notif0_text = "";
  notif1_text = "";
  notif2_text = "";
  notif3_text = "";
}

function start_frenzy() {
  frenzy_active = true;
  frenzy_timer = 6.0;
  frenzy_speed_mult = 2.0;
  pepper_rush = true;
  rush_timer = 6.0;
  push_notif("PEPPER RUSH!", "#ffd700", 3.0);
  push_notif("ALL DROPS 5x! SPEED x2!", "#ffffff", 2.5);
  fp_x0 = Math.random() * 400.0;
  fp_y0 = Math.random() * -200.0;
  fp_s0 = 2.0 + Math.random() * 4.0;
  fp_x1 = Math.random() * 400.0;
  fp_y1 = Math.random() * -200.0;
  fp_s1 = 2.0 + Math.random() * 4.0;
  fp_x2 = Math.random() * 400.0;
  fp_y2 = Math.random() * -200.0;
  fp_s2 = 2.0 + Math.random() * 4.0;
  fp_x3 = Math.random() * 400.0;
  fp_y3 = Math.random() * -200.0;
  fp_s3 = 2.0 + Math.random() * 4.0;
  fp_x4 = Math.random() * 400.0;
  fp_y4 = Math.random() * -200.0;
  fp_s4 = 2.0 + Math.random() * 4.0;
  fp_x5 = Math.random() * 400.0;
  fp_y5 = Math.random() * -200.0;
  fp_s5 = 2.0 + Math.random() * 4.0;
  fp_x6 = Math.random() * 400.0;
  fp_y6 = Math.random() * -200.0;
  fp_s6 = 2.0 + Math.random() * 4.0;
  fp_x7 = Math.random() * 400.0;
  fp_y7 = Math.random() * -200.0;
  fp_s7 = 2.0 + Math.random() * 4.0;
  fp_x8 = Math.random() * 400.0;
  fp_y8 = Math.random() * -200.0;
  fp_s8 = 2.0 + Math.random() * 4.0;
  fp_x9 = Math.random() * 400.0;
  fp_y9 = Math.random() * -200.0;
  fp_s9 = 2.0 + Math.random() * 4.0;
  fp_x10 = Math.random() * 400.0;
  fp_y10 = Math.random() * -200.0;
  fp_s10 = 2.0 + Math.random() * 4.0;
  fp_x11 = Math.random() * 400.0;
  fp_y11 = Math.random() * -200.0;
  fp_s11 = 2.0 + Math.random() * 4.0;
  __audio.sfxLevelup();
  __audio.sweep(200.0, 2000.0, 0.5, 0.4);
}

function update_frenzy(dt) {
  if (frenzy_active) {
    frenzy_timer = frenzy_timer - dt;
    if (frenzy_timer <= 0.0) {
      frenzy_active = false;
      frenzy_speed_mult = 1.0;
      frenzy_cooldown = 25.0 + Math.random() * 20.0;
    }
    const fspeed = 400.0 + Math.random() * 200.0;
    fp_y0 = fp_y0 + fspeed * dt;
    if (fp_y0 > 520.0) {
      fp_y0 = -20.0;
      fp_x0 = Math.random() * 400.0;
    }
    fp_y1 = fp_y1 + fspeed * dt;
    if (fp_y1 > 520.0) {
      fp_y1 = -20.0;
      fp_x1 = Math.random() * 400.0;
    }
    fp_y2 = fp_y2 + fspeed * dt;
    if (fp_y2 > 520.0) {
      fp_y2 = -20.0;
      fp_x2 = Math.random() * 400.0;
    }
    fp_y3 = fp_y3 + fspeed * dt;
    if (fp_y3 > 520.0) {
      fp_y3 = -20.0;
      fp_x3 = Math.random() * 400.0;
    }
    fp_y4 = fp_y4 + fspeed * dt;
    if (fp_y4 > 520.0) {
      fp_y4 = -20.0;
      fp_x4 = Math.random() * 400.0;
    }
    fp_y5 = fp_y5 + fspeed * dt;
    if (fp_y5 > 520.0) {
      fp_y5 = -20.0;
      fp_x5 = Math.random() * 400.0;
    }
    fp_y6 = fp_y6 + fspeed * dt;
    if (fp_y6 > 520.0) {
      fp_y6 = -20.0;
      fp_x6 = Math.random() * 400.0;
    }
    fp_y7 = fp_y7 + fspeed * dt;
    if (fp_y7 > 520.0) {
      fp_y7 = -20.0;
      fp_x7 = Math.random() * 400.0;
    }
    fp_y8 = fp_y8 + fspeed * dt;
    if (fp_y8 > 520.0) {
      fp_y8 = -20.0;
      fp_x8 = Math.random() * 400.0;
    }
    fp_y9 = fp_y9 + fspeed * dt;
    if (fp_y9 > 520.0) {
      fp_y9 = -20.0;
      fp_x9 = Math.random() * 400.0;
    }
    fp_y10 = fp_y10 + fspeed * dt;
    if (fp_y10 > 520.0) {
      fp_y10 = -20.0;
      fp_x10 = Math.random() * 400.0;
    }
    fp_y11 = fp_y11 + fspeed * dt;
    if (fp_y11 > 520.0) {
      fp_y11 = -20.0;
      fp_x11 = Math.random() * 400.0;
    }
    if (Math.random() < dt * 2.0) {
      __audio.beep(800.0 + Math.random() * 1200.0, 0.05, 0.15);
    }
  } else {
    frenzy_cooldown = frenzy_cooldown - dt;
    if (frenzy_cooldown <= 0.0) {
      start_frenzy();
    }
  }
}

function draw_frenzy_particles() {
  if (frenzy_active == false) {
    return;
  }
  const alpha = 0.6 + Math.sin(anim_time * 10.0) * 0.3;
  (() => { __ctx.fillStyle = "rgba(255,215,0,0.7)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x0, fp_y0, fp_s0, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x2, fp_y2, fp_s2, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x4, fp_y4, fp_s4, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x6, fp_y6, fp_s6, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x8, fp_y8, fp_s8, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x10, fp_y10, fp_s10, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.8)"; })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x1, fp_y1, fp_s1, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x3, fp_y3, fp_s3, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x5, fp_y5, fp_s5, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x7, fp_y7, fp_s7, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x9, fp_y9, fp_s9, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.beginPath(); __ctx.arc(fp_x11, fp_y11, fp_s11, 0, 2 * Math.PI); __ctx.fill(); })();
  (() => { __ctx.fillStyle = "rgba(255,215,0,0.2)"; })();
  __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
}

function handle_drop_catch(dv, cx, cy) {
  let val = dv;
  if (pepper_rush) {
    val = 5.0;
  }
  const mult = combo_multiplier();
  let pts = val * 10.0 * mult;
  if (double_pts_timer > 0.0) {
    pts = pts * 2.0;
  }
  score = score + pts;
  combo = combo + 1.0;
  combo_timer = 2.0;
  combo_scale = 1.5;
  catches_total = catches_total + 1.0;
  fake_catches = fake_catches + 1.0;
  if (combo > max_combo) {
    max_combo = combo;
  }
  fill = fill + 2.0;
  if (fill > 100.0) {
    fill = 100.0;
  }
  xp_bar = xp_bar + 1.0;
  if (xp_bar > 20.0) {
    xp_bar = 0.0;
  }
  float_score_val = pts;
  float_score_x = cx;
  float_score_y = cy;
  float_score_timer = 1.0;
  shake = 1.0;
  __audio.sfxCoin();
  if (combo > 1.0) {
    __audio.sfxCombo(combo);
  }
  if (dv == 10.0) {
    jackpot_timer = 0.5;
    lucky_timer = 1.5;
    shake = 8.0;
    __audio.sfxLevelup();
    push_notif("LUCKY! JACKPOT!", "#ffd700", 1.5);
  }
  const catch_mod = catches_total - Math.floor(catches_total / 10.0) * 10.0;
  if (catch_mod == 0.0) {
    if (catches_total > 0.0) {
      bonus_timer = 0.3;
      const br = Math.random();
      if (br < 0.33) {
        bonus_type = 0.0;
        double_pts_timer = 3.0;
        push_notif("DOUBLE POINTS!", "#ffd700", 1.5);
      }
      if (br >= 0.33) {
        if (br < 0.66) {
          bonus_type = 1.0;
          lives = lives + 1.0;
          if (lives > 5.0) {
            lives = 5.0;
          }
          push_notif("EXTRA LIFE!", "#ffd700", 1.5);
        }
      }
      if (br >= 0.66) {
        bonus_type = 2.0;
        shield = true;
        push_notif("SHIELD!", "#9b59b6", 1.5);
      }
      __audio.sfxPowerup();
    }
  }
}

function handle_drop_miss() {
  const old_combo = combo;
  if (shield) {
    shield = false;
    return;
  }
  lives = lives - 1.0;
  shake = 5.0;
  __audio.sfxHit();
  fill = fill - 5.0;
  if (fill < 0.0) {
    fill = 0.0;
  }
  if (old_combo >= 5.0) {
    combo_broken_timer = 1.5;
    combo_broken_val = old_combo;
    push_notif("COMBO BROKEN!", "#ff3333", 1.5);
  }
  combo = 0.0;
  combo_timer = 0.0;
  if (lives <= 0.0) {
    lives = 0.0;
    if (score > best_score) {
      best_score = score;
    }
    game_state = 3.0;
    go_delay = 0.0;
    __audio.sfxGameover();
  }
}

function frame() {
  const dt = 0.016;
  anim_time = anim_time + dt;
  if (__input.keyJustPressed("m")) {
    if (muted) {
      muted = false;
      __audio.unmute();
    } else {
      muted = true;
      __audio.mute();
    }
  }
  if (game_state == 0.0) {
    draw_background();
    const menu_d0y = anim_time * 60.0 - Math.floor(anim_time * 60.0 / 500.0) * 500.0;
    const menu_d1y = anim_time * 45.0 + 200.0 - Math.floor((anim_time * 45.0 + 200.0) / 500.0) * 500.0;
    const menu_d2y = anim_time * 75.0 + 350.0 - Math.floor((anim_time * 75.0 + 350.0) / 500.0) * 500.0;
    draw_teardrop(60.0, menu_d0y, 6.0, "#8b0023", false);
    draw_teardrop(300.0, menu_d1y, 7.0, "#c0392b", false);
    draw_teardrop(180.0, menu_d2y, 5.0, "#ff6b35", false);
    (() => { __ctx.fillStyle = "rgba(90,0,24,0.85)"; })();
    __ctx.fillRect(30.0, 60.0, 340.0, 120.0);
    (() => { __ctx.strokeStyle = "#c9a832"; })();
    (() => { __ctx.lineWidth = 2.0; })();
    __ctx.strokeRect(30.0, 60.0, 340.0, 120.0);
    (() => { __ctx.fillStyle = "#8b0023"; })();
    (() => { __ctx.font = "bold 32px Arial"; })();
    __ctx.fillText("DR PEPPER", 90.0, 110.0);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 16px Arial"; })();
    __ctx.fillText("CATCH THE DROP", 120.0, 145.0);
    const bob = Math.sin(anim_time * 3.0) * 5.0;
    draw_teardrop(55.0, 90.0 + bob, 8.0, "#8b0023", false);
    draw_teardrop(345.0, 100.0 - bob, 8.0, "#8b0023", false);
    draw_teardrop(200.0, 68.0 + bob * 0.5, 6.0, "#ffd700", true);
    const pulse = Math.sin(anim_time * 4.0) * 3.0;
    (() => { __ctx.fillStyle = "rgba(201,168,50,0.9)"; })();
    __ctx.fillRect(130.0, 210.0 - pulse * 0.5, 140.0, 40.0);
    (() => { __ctx.strokeStyle = "#ffd700"; })();
    (() => { __ctx.lineWidth = 2.0; })();
    __ctx.strokeRect(130.0, 210.0 - pulse * 0.5, 140.0, 40.0);
    (() => { __ctx.fillStyle = "#ffffff"; })();
    (() => { __ctx.font = "bold 22px Arial"; })();
    __ctx.fillText("PLAY", 168.0, 238.0 - pulse * 0.5);
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.7)"; })();
    (() => { __ctx.font = "bold 14px Arial"; })();
    __ctx.fillText("STYLE:", 60.0, 290.0);
    let s0c = "#555555";
    if (style_sel == 0.0) {
      s0c = "#ffd700";
    }
    (() => { __ctx.fillStyle = s0c; })();
    (() => { __ctx.font = "bold 13px Arial"; })();
    __ctx.fillText("Classic", 120.0, 290.0);
    let s1c = "#555555";
    if (style_sel == 1.0) {
      s1c = "#ff00ff";
    }
    (() => { __ctx.fillStyle = s1c; })();
    __ctx.fillText("Neon", 200.0, 290.0);
    let s2c = "#555555";
    if (style_sel == 2.0) {
      s2c = "#00ccff";
    }
    (() => { __ctx.fillStyle = s2c; })();
    __ctx.fillText("Ocean", 260.0, 290.0);
    if (best_score > 0.0) {
      const bs = Math.floor(best_score);
      (() => { __ctx.fillStyle = "#ffd700"; })();
      (() => { __ctx.font = "bold 14px Arial"; })();
      __ctx.fillText(`BEST: ${bs}`, 155.0, 320.0);
    }
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
    (() => { __ctx.font = "12px Arial"; })();
    if (muted) {
      __ctx.fillText("[MUTED] Press M to unmute", 110.0, 350.0);
    } else {
      __ctx.fillText("Press M to mute", 140.0, 350.0);
    }
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.4)"; })();
    (() => { __ctx.font = "11px Arial"; })();
    __ctx.fillText("Arrow keys / WASD / Mouse / Touch to move", 70.0, 390.0);
    __ctx.fillText("Catch weapons to auto-fire | ESC = Pause | M = Mute", 40.0, 410.0);
    __ctx.fillText("Press ENTER or click PLAY to start", 90.0, 440.0);
    if (__input.mouseJustClicked()) {
      const mcx = __input.mouseX();
      const mcy = __input.mouseY();
      if (mcx > 115.0) {
        if (mcx < 190.0) {
          if (mcy > 275.0) {
            if (mcy < 300.0) {
              style_sel = 0.0;
              __audio.sfxCoin();
            }
          }
        }
      }
      if (mcx > 195.0) {
        if (mcx < 250.0) {
          if (mcy > 275.0) {
            if (mcy < 300.0) {
              style_sel = 1.0;
              __audio.sfxCoin();
            }
          }
        }
      }
      if (mcx > 255.0) {
        if (mcx < 320.0) {
          if (mcy > 275.0) {
            if (mcy < 300.0) {
              style_sel = 2.0;
              __audio.sfxCoin();
            }
          }
        }
      }
      if (mcx > 130.0) {
        if (mcx < 270.0) {
          if (mcy > 200.0) {
            if (mcy < 260.0) {
              reset_game();
              game_state = 1.0;
              if (audio_started == false) {
                __audio.init();
                audio_started = true;
              }
              __audio.sfxPowerup();
            }
          }
        }
      }
    }
    if (__input.keyJustPressed("Enter")) {
      reset_game();
      game_state = 1.0;
      if (audio_started == false) {
        __audio.init();
        audio_started = true;
      }
      __audio.sfxPowerup();
    }
    if (__input.keyJustPressed("1")) {
      style_sel = 0.0;
      __audio.sfxCoin();
    }
    if (__input.keyJustPressed("2")) {
      style_sel = 1.0;
      __audio.sfxCoin();
    }
    if (__input.keyJustPressed("3")) {
      style_sel = 2.0;
      __audio.sfxCoin();
    }
    return;
  }
  if (game_state == 3.0) {
    go_delay = go_delay + dt;
    if (go_delay > 5.0) {
      go_delay = 5.0;
    }
    draw_background();
    (() => { __ctx.fillStyle = "rgba(0,0,0,0.75)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
    if (go_delay < 0.3) {
      (() => { __ctx.fillStyle = "rgba(139,0,0,0.4)"; })();
      __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
    }
    (() => { __ctx.fillStyle = "rgba(90,0,24,0.9)"; })();
    __ctx.fillRect(40.0, 60.0, 320.0, 360.0);
    (() => { __ctx.strokeStyle = "#c9a832"; })();
    (() => { __ctx.lineWidth = 3.0; })();
    __ctx.strokeRect(40.0, 60.0, 320.0, 360.0);
    (() => { __ctx.fillStyle = "#ff3333"; })();
    (() => { __ctx.font = "bold 38px Arial"; })();
    __ctx.fillText("GAME OVER", 65.0, 120.0);
    const go_score = Math.floor(score);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 36px Arial"; })();
    __ctx.fillText(`${go_score}`, 130.0, 175.0);
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.6)"; })();
    (() => { __ctx.font = "14px Arial"; })();
    __ctx.fillText("POINTS", 170.0, 195.0);
    if (score >= best_score) {
      if (score > 0.0) {
        (() => { __ctx.fillStyle = "#ffd700"; })();
        (() => { __ctx.font = "bold 16px Arial"; })();
        __ctx.fillText("NEW BEST!", 155.0, 220.0);
      }
    }
    (() => { __ctx.fillStyle = "#ffffff"; })();
    (() => { __ctx.font = "16px Arial"; })();
    const go_lv = Math.floor(level);
    const go_mc = Math.floor(max_combo);
    const go_bs = Math.floor(best_score);
    __ctx.fillText(`Level: ${go_lv}`, 150.0, 255.0);
    __ctx.fillText(`Max Combo: ${go_mc}x`, 135.0, 280.0);
    __ctx.fillText(`Best Score: ${go_bs}`, 130.0, 305.0);
    const beat_pct = Math.floor(Math.random() * 45.0 + 40.0);
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.8)"; })();
    (() => { __ctx.font = "bold 14px Arial"; })();
    __ctx.fillText("You beat 67% of players!", 110.0, 340.0);
    if (go_delay >= 1.0) {
      const blink = Math.sin(anim_time * 4.0);
      if (blink > -0.3) {
        (() => { __ctx.fillStyle = "rgba(255,255,255,0.7)"; })();
        (() => { __ctx.font = "bold 14px Arial"; })();
        __ctx.fillText("Press ENTER to try again", 105.0, 390.0);
      }
      if (__input.keyJustPressed("Enter")) {
        reset_game();
        game_state = 1.0;
        __audio.sfxCoin();
      }
      if (__input.mouseJustClicked()) {
        reset_game();
        game_state = 1.0;
        __audio.sfxCoin();
      }
    } else {
      (() => { __ctx.fillStyle = "rgba(255,255,255,0.3)"; })();
      (() => { __ctx.font = "12px Arial"; })();
      __ctx.fillText("Wait...", 175.0, 390.0);
    }
    return;
  }
  if (game_state == 4.0) {
    level_complete_timer = level_complete_timer - dt;
    draw_background();
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.12)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
    (() => { __ctx.fillStyle = "rgba(0,0,0,0.6)"; })();
    __ctx.fillRect(60.0, 140.0, 280.0, 200.0);
    (() => { __ctx.strokeStyle = "#ffd700"; })();
    (() => { __ctx.lineWidth = 3.0; })();
    __ctx.strokeRect(60.0, 140.0, 280.0, 200.0);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 30px Arial"; })();
    __ctx.fillText("LEVEL UP!", 110.0, 190.0);
    const lv_show = Math.floor(level);
    (() => { __ctx.fillStyle = "#ffffff"; })();
    (() => { __ctx.font = "bold 22px Arial"; })();
    __ctx.fillText(`Level ${lv_show}`, 145.0, 230.0);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 28px Arial"; })();
    if (level_stars >= 3.0) {
      __ctx.fillText("* * *", 155.0, 280.0);
    }
    if (level_stars == 2.0) {
      __ctx.fillText("* *", 165.0, 280.0);
      (() => { __ctx.fillStyle = "#555"; })();
      __ctx.fillText("*", 215.0, 280.0);
    }
    if (level_stars == 1.0) {
      __ctx.fillText("*", 155.0, 280.0);
      (() => { __ctx.fillStyle = "#555"; })();
      __ctx.fillText("* *", 175.0, 280.0);
    }
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
    (() => { __ctx.font = "11px Arial"; })();
    __ctx.fillText("Complete | >50% fill | >80% fill", 105.0, 310.0);
    if (level_complete_timer <= 0.0) {
      game_state = 1.0;
      level_timer = 30.0;
      fill = 10.0;
    }
    return;
  }
  if (__input.keyJustPressed("Escape")) {
    if (game_state == 1.0) {
      game_state = 2.0;
    } else {
      if (game_state == 2.0) {
        game_state = 1.0;
      }
    }
  }
  if (game_state == 2.0) {
    draw_background();
    (() => { __ctx.fillStyle = "rgba(0,0,0,0.75)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 36px Arial"; })();
    __ctx.fillText("PAUSED", 115.0, 230.0);
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.5)"; })();
    (() => { __ctx.font = "16px Arial"; })();
    __ctx.fillText("Press ESC to resume", 115.0, 270.0);
    const s_hud = Math.floor(score);
    (() => { __ctx.fillStyle = "#ffffff"; })();
    (() => { __ctx.font = "14px Arial"; })();
    __ctx.fillText(`Score: ${s_hud}`, 155.0, 310.0);
    return;
  }
  if (game_state == 1.0) {
    if (frozen == false) {
      if (__input.keyIsDown("ArrowLeft")) {
        px = px - pspeed * dt;
      }
      if (__input.keyIsDown("ArrowRight")) {
        px = px + pspeed * dt;
      }
      if (__input.keyIsDown("a")) {
        px = px - pspeed * dt;
      }
      if (__input.keyIsDown("d")) {
        px = px + pspeed * dt;
      }
      if (__input.mouseIsDown()) {
        px = __input.mouseX() - pw / 2.0;
      }
      if (__input.touchIsActive()) {
        px = __input.touchX() - pw / 2.0;
      }
    }
    if (px < 0.0) {
      px = 0.0;
    }
    if (px > 400.0 - pw) {
      px = 400.0 - pw;
    }
    level_timer = level_timer - dt;
    if (frozen) {
      freeze_timer = freeze_timer - dt;
      if (freeze_timer <= 0.0) {
        frozen = false;
      }
    }
    if (wide_timer > 0.0) {
      wide_timer = wide_timer - dt;
      if (wide_timer <= 0.0) {
        pw = 70.0;
      }
    }
    if (pepper_rush) {
      rush_timer = rush_timer - dt;
      if (rush_timer <= 0.0) {
        pepper_rush = false;
      }
    }
    if (combo_timer > 0.0) {
      combo_timer = combo_timer - dt;
      if (combo_timer <= 0.0) {
        combo = 0.0;
      }
    }
    if (near_miss_timer > 0.0) {
      near_miss_timer = near_miss_timer - dt;
    }
    if (combo_broken_timer > 0.0) {
      combo_broken_timer = combo_broken_timer - dt;
    }
    if (jackpot_timer > 0.0) {
      jackpot_timer = jackpot_timer - dt;
    }
    if (lucky_timer > 0.0) {
      lucky_timer = lucky_timer - dt;
    }
    if (bonus_timer > 0.0) {
      bonus_timer = bonus_timer - dt;
    }
    if (double_pts_timer > 0.0) {
      double_pts_timer = double_pts_timer - dt;
    }
    if (float_score_timer > 0.0) {
      float_score_timer = float_score_timer - dt;
    }
    if (powerup_flash_timer > 0.0) {
      powerup_flash_timer = powerup_flash_timer - dt;
    }
    if (shake > 0.0) {
      shake = shake - dt * 10.0;
      if (shake < 0.0) {
        shake = 0.0;
      }
    }
    update_frenzy(dt);
    if (sp_active) {
      sp_timer = sp_timer - dt;
      if (sp_timer <= 0.0) {
        sp_active = false;
      }
    }
    if (combo_scale > 1.0) {
      combo_scale = combo_scale - dt * 3.0;
      if (combo_scale < 1.0) {
        combo_scale = 1.0;
      }
    }
    pow_spin = pow_spin + dt * 3.0;
    danger_pulse = danger_pulse + dt * 6.0;
    fake_catches = fake_catches + dt * 0.3;
    if (weapon_type > 0.0) {
      weapon_timer = weapon_timer - dt;
      if (weapon_timer <= 0.0) {
        weapon_type = 0.0;
        weapon_timer = 0.0;
      }
    }
    if (frozen_drops) {
      frozen_drop_timer = frozen_drop_timer - dt;
      if (frozen_drop_timer <= 0.0) {
        frozen_drops = false;
      }
    }
    if (shield_burst) {
      shield_burst_timer = shield_burst_timer - dt;
      shield_burst_radius = shield_burst_radius + dt * 300.0;
      if (shield_burst_timer <= 0.0) {
        shield_burst = false;
        shield_burst_radius = 0.0;
      }
    }
    if (hit_active) {
      hit_timer = hit_timer - dt;
      if (hit_timer <= 0.0) {
        hit_active = false;
      }
    }
    if (freeze_tint_timer > 0.0) {
      freeze_tint_timer = freeze_tint_timer - dt;
    }
    wp_spin = wp_spin + dt * 3.0;
    wp_spawn_timer = wp_spawn_timer - dt;
    if (wp_spawn_timer <= 0.0) {
      if (wp_active == false) {
        wp_x = random_x();
        wp_y = -40.0;
        wp_active = true;
        wp_type = Math.floor(Math.random() * 4.0);
        wp_spawn_timer = 15.0 + Math.random() * 5.0;
      } else {
        wp_spawn_timer = 5.0;
      }
    }
    if (wp_active) {
      wp_y = wp_y + drop_speed * 0.5 * dt;
      if (wp_y > 510.0) {
        wp_active = false;
        wp_y = -1000.0;
      }
    }
    if (wp_active) {
      if (wp_y + 28.0 > py) {
        if (wp_x + 28.0 > px) {
          if (wp_x < px + pw) {
            wp_active = false;
            wp_y = -1000.0;
            const caught_weapon = wp_type + 1.0;
            __audio.sfxPowerup();
            shake = 2.0;
            powerup_flash_timer = 0.2;
            powerup_flash_color = "#00ffff";
            const fcx = px + pw / 2.0;
            const fcy = py;
            if (caught_weapon == 1.0) {
              fire_laser(fcx, fcy, 0.0);
              fire_laser(fcx, fcy, 0.0 - 0.2618);
              fire_laser(fcx, fcy, 0.2618);
              __audio.beep(880.0, 0.05, 0.3);
              shake = 3.0;
            }
            if (caught_weapon == 2.0) {
              mb_x = fcx;
              mb_y = fcy;
              mb_active = true;
              mb_radius = 100.0;
              __audio.beep(110.0, 0.2, 0.5);
              shake = 5.0;
              let mdx0 = d_x0 - fcx;
              let mdy0 = d_y0 - fcy;
              if (mdx0 < 0.0) {
                mdx0 = 0.0 - mdx0;
              }
              if (mdy0 < 0.0) {
                mdy0 = 0.0 - mdy0;
              }
              if (mdx0 < 100.0) {
                if (mdy0 < 100.0) {
                  score = score + 10.0;
                  spawn_hit_explosion(d_x0, d_y0);
                  d_x0 = random_x();
                  d_y0 = -40.0;
                  d_v0 = random_value();
                }
              }
              let mdx1 = d_x1 - fcx;
              let mdy1 = d_y1 - fcy;
              if (mdx1 < 0.0) {
                mdx1 = 0.0 - mdx1;
              }
              if (mdy1 < 0.0) {
                mdy1 = 0.0 - mdy1;
              }
              if (mdx1 < 100.0) {
                if (mdy1 < 100.0) {
                  score = score + 10.0;
                  spawn_hit_explosion(d_x1, d_y1);
                  d_x1 = random_x();
                  d_y1 = -40.0 - Math.random() * 100.0;
                  d_v1 = random_value();
                }
              }
              let mdx2 = d_x2 - fcx;
              let mdy2 = d_y2 - fcy;
              if (mdx2 < 0.0) {
                mdx2 = 0.0 - mdx2;
              }
              if (mdy2 < 0.0) {
                mdy2 = 0.0 - mdy2;
              }
              if (mdx2 < 100.0) {
                if (mdy2 < 100.0) {
                  score = score + 10.0;
                  spawn_hit_explosion(d_x2, d_y2);
                  d_x2 = random_x();
                  d_y2 = -40.0 - Math.random() * 150.0;
                  d_v2 = random_value();
                }
              }
              let mdx3 = d_x3 - fcx;
              let mdy3 = d_y3 - fcy;
              if (mdx3 < 0.0) {
                mdx3 = 0.0 - mdx3;
              }
              if (mdy3 < 0.0) {
                mdy3 = 0.0 - mdy3;
              }
              if (mdx3 < 100.0) {
                if (mdy3 < 100.0) {
                  score = score + 10.0;
                  spawn_hit_explosion(d_x3, d_y3);
                  d_x3 = random_x();
                  d_y3 = -40.0 - Math.random() * 200.0;
                  d_v3 = random_value();
                }
              }
            }
            if (caught_weapon == 3.0) {
              frozen_drops = true;
              frozen_drop_timer = 3.0;
              freeze_tint_timer = 0.3;
              __audio.sweep(2000.0, 4000.0, 0.15, 0.3);
            }
            if (caught_weapon == 4.0) {
              shield_burst = true;
              shield_burst_timer = 1.0;
              shield_burst_radius = 10.0;
              shield = true;
              __audio.noise(0.1, 0.4);
              shake = 4.0;
            }
          }
        }
      }
    }
    if (l_active0) {
      l_x0 = l_x0 + Math.sin(l_ang0) * 600.0 * dt;
      l_y0 = l_y0 - Math.cos(l_ang0) * 600.0 * dt;
      if (l_y0 < -20.0) {
        l_active0 = false;
      }
      if (l_x0 < -20.0) {
        l_active0 = false;
      }
      if (l_x0 > 420.0) {
        l_active0 = false;
      }
    }
    if (l_active1) {
      l_x1 = l_x1 + Math.sin(l_ang1) * 600.0 * dt;
      l_y1 = l_y1 - Math.cos(l_ang1) * 600.0 * dt;
      if (l_y1 < -20.0) {
        l_active1 = false;
      }
      if (l_x1 < -20.0) {
        l_active1 = false;
      }
      if (l_x1 > 420.0) {
        l_active1 = false;
      }
    }
    if (l_active2) {
      l_x2 = l_x2 + Math.sin(l_ang2) * 600.0 * dt;
      l_y2 = l_y2 - Math.cos(l_ang2) * 600.0 * dt;
      if (l_y2 < -20.0) {
        l_active2 = false;
      }
      if (l_x2 < -20.0) {
        l_active2 = false;
      }
      if (l_x2 > 420.0) {
        l_active2 = false;
      }
    }
    if (mb_active) {
      mb_y = mb_y - 300.0 * dt;
      if (mb_y < -40.0) {
        mb_active = false;
      }
    }
    if (l_active0) {
      if (check_laser_hit_drop(l_x0, l_y0, d_x0, d_y0)) {
        l_active0 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x0, d_y0);
        __audio.beep(440.0, 0.1, 0.2);
        d_x0 = random_x();
        d_y0 = -40.0;
        d_v0 = random_value();
      }
    }
    if (l_active1) {
      if (check_laser_hit_drop(l_x1, l_y1, d_x0, d_y0)) {
        l_active1 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x0, d_y0);
        __audio.beep(440.0, 0.1, 0.2);
        d_x0 = random_x();
        d_y0 = -40.0;
        d_v0 = random_value();
      }
    }
    if (l_active2) {
      if (check_laser_hit_drop(l_x2, l_y2, d_x0, d_y0)) {
        l_active2 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x0, d_y0);
        __audio.beep(440.0, 0.1, 0.2);
        d_x0 = random_x();
        d_y0 = -40.0;
        d_v0 = random_value();
      }
    }
    if (l_active0) {
      if (check_laser_hit_drop(l_x0, l_y0, d_x1, d_y1)) {
        l_active0 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x1, d_y1);
        __audio.beep(440.0, 0.1, 0.2);
        d_x1 = random_x();
        d_y1 = -40.0 - Math.random() * 100.0;
        d_v1 = random_value();
      }
    }
    if (l_active1) {
      if (check_laser_hit_drop(l_x1, l_y1, d_x1, d_y1)) {
        l_active1 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x1, d_y1);
        __audio.beep(440.0, 0.1, 0.2);
        d_x1 = random_x();
        d_y1 = -40.0 - Math.random() * 100.0;
        d_v1 = random_value();
      }
    }
    if (l_active2) {
      if (check_laser_hit_drop(l_x2, l_y2, d_x1, d_y1)) {
        l_active2 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x1, d_y1);
        __audio.beep(440.0, 0.1, 0.2);
        d_x1 = random_x();
        d_y1 = -40.0 - Math.random() * 100.0;
        d_v1 = random_value();
      }
    }
    if (l_active0) {
      if (check_laser_hit_drop(l_x0, l_y0, d_x2, d_y2)) {
        l_active0 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x2, d_y2);
        __audio.beep(440.0, 0.1, 0.2);
        d_x2 = random_x();
        d_y2 = -40.0 - Math.random() * 150.0;
        d_v2 = random_value();
      }
    }
    if (l_active1) {
      if (check_laser_hit_drop(l_x1, l_y1, d_x2, d_y2)) {
        l_active1 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x2, d_y2);
        __audio.beep(440.0, 0.1, 0.2);
        d_x2 = random_x();
        d_y2 = -40.0 - Math.random() * 150.0;
        d_v2 = random_value();
      }
    }
    if (l_active2) {
      if (check_laser_hit_drop(l_x2, l_y2, d_x2, d_y2)) {
        l_active2 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x2, d_y2);
        __audio.beep(440.0, 0.1, 0.2);
        d_x2 = random_x();
        d_y2 = -40.0 - Math.random() * 150.0;
        d_v2 = random_value();
      }
    }
    if (l_active0) {
      if (check_laser_hit_drop(l_x0, l_y0, d_x3, d_y3)) {
        l_active0 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x3, d_y3);
        __audio.beep(440.0, 0.1, 0.2);
        d_x3 = random_x();
        d_y3 = -40.0 - Math.random() * 200.0;
        d_v3 = random_value();
      }
    }
    if (l_active1) {
      if (check_laser_hit_drop(l_x1, l_y1, d_x3, d_y3)) {
        l_active1 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x3, d_y3);
        __audio.beep(440.0, 0.1, 0.2);
        d_x3 = random_x();
        d_y3 = -40.0 - Math.random() * 200.0;
        d_v3 = random_value();
      }
    }
    if (l_active2) {
      if (check_laser_hit_drop(l_x2, l_y2, d_x3, d_y3)) {
        l_active2 = false;
        score = score + 10.0;
        spawn_hit_explosion(d_x3, d_y3);
        __audio.beep(440.0, 0.1, 0.2);
        d_x3 = random_x();
        d_y3 = -40.0 - Math.random() * 200.0;
        d_v3 = random_value();
      }
    }
    if (obs_active) {
      if (l_active0) {
        if (check_laser_hit_drop(l_x0, l_y0, obs_x + 13.0, obs_y + 13.0)) {
          l_active0 = false;
          obs_active = false;
          obs_y = -600.0;
          score = score + 50.0;
          spawn_hit_explosion(obs_x + 13.0, obs_y + 13.0);
          __audio.beep(440.0, 0.1, 0.2);
        }
      }
      if (l_active1) {
        if (check_laser_hit_drop(l_x1, l_y1, obs_x + 13.0, obs_y + 13.0)) {
          l_active1 = false;
          obs_active = false;
          obs_y = -600.0;
          score = score + 50.0;
          spawn_hit_explosion(obs_x + 13.0, obs_y + 13.0);
          __audio.beep(440.0, 0.1, 0.2);
        }
      }
      if (l_active2) {
        if (check_laser_hit_drop(l_x2, l_y2, obs_x + 13.0, obs_y + 13.0)) {
          l_active2 = false;
          obs_active = false;
          obs_y = -600.0;
          score = score + 50.0;
          spawn_hit_explosion(obs_x + 13.0, obs_y + 13.0);
          __audio.beep(440.0, 0.1, 0.2);
        }
      }
    }
    if (mb_active) {
      if (check_mega_hit(mb_x, mb_y, d_x0, d_y0)) {
        score = score + 10.0;
        spawn_hit_explosion(d_x0, d_y0);
        d_x0 = random_x();
        d_y0 = -40.0;
        d_v0 = random_value();
      }
      if (check_mega_hit(mb_x, mb_y, d_x1, d_y1)) {
        score = score + 10.0;
        spawn_hit_explosion(d_x1, d_y1);
        d_x1 = random_x();
        d_y1 = -40.0 - Math.random() * 100.0;
        d_v1 = random_value();
      }
      if (check_mega_hit(mb_x, mb_y, d_x2, d_y2)) {
        score = score + 10.0;
        spawn_hit_explosion(d_x2, d_y2);
        d_x2 = random_x();
        d_y2 = -40.0 - Math.random() * 150.0;
        d_v2 = random_value();
      }
      if (check_mega_hit(mb_x, mb_y, d_x3, d_y3)) {
        score = score + 10.0;
        spawn_hit_explosion(d_x3, d_y3);
        d_x3 = random_x();
        d_y3 = -40.0 - Math.random() * 200.0;
        d_v3 = random_value();
      }
      if (obs_active) {
        if (check_mega_hit(mb_x, mb_y, obs_x + 13.0, obs_y + 13.0)) {
          obs_active = false;
          obs_y = -600.0;
          score = score + 50.0;
          spawn_hit_explosion(obs_x + 13.0, obs_y + 13.0);
        }
      }
    }
    if (shield_burst) {
      const scx = px + pw / 2.0;
      const scy = py + ph / 2.0;
      const kb = 100.0 * dt * 10.0;
      const dd0x = d_x0 - scx;
      const dd0y = d_y0 - scy;
      if (dd0x > 0.0) {
        d_x0 = d_x0 + kb;
      } else {
        d_x0 = d_x0 - kb;
      }
      if (dd0y > 0.0) {
        d_y0 = d_y0 + kb;
      } else {
        d_y0 = d_y0 - kb;
      }
      const dd1x = d_x1 - scx;
      const dd1y = d_y1 - scy;
      if (dd1x > 0.0) {
        d_x1 = d_x1 + kb;
      } else {
        d_x1 = d_x1 - kb;
      }
      if (dd1y > 0.0) {
        d_y1 = d_y1 + kb;
      } else {
        d_y1 = d_y1 - kb;
      }
      const dd2x = d_x2 - scx;
      const dd2y = d_y2 - scy;
      if (dd2x > 0.0) {
        d_x2 = d_x2 + kb;
      } else {
        d_x2 = d_x2 - kb;
      }
      if (dd2y > 0.0) {
        d_y2 = d_y2 + kb;
      } else {
        d_y2 = d_y2 - kb;
      }
      const dd3x = d_x3 - scx;
      const dd3y = d_y3 - scy;
      if (dd3x > 0.0) {
        d_x3 = d_x3 + kb;
      } else {
        d_x3 = d_x3 - kb;
      }
      if (dd3y > 0.0) {
        d_y3 = d_y3 + kb;
      } else {
        d_y3 = d_y3 - kb;
      }
      if (obs_active) {
        const dox = obs_x - scx;
        const doy = obs_y - scy;
        if (dox > 0.0) {
          obs_x = obs_x + kb;
        } else {
          obs_x = obs_x - kb;
        }
        if (doy > 0.0) {
          obs_y = obs_y + kb;
        } else {
          obs_y = obs_y - kb;
        }
      }
    }
    drop_speed = 180.0 + (level - 1.0) * 18.0;
    if (frozen_drops == false) {
      d_wobble0 = d_wobble0 + dt * 4.0;
      d_y0 = d_y0 + drop_speed * frenzy_speed_mult * dt;
      d_x0 = d_x0 + Math.sin(d_wobble0) * 0.5;
      d_wobble1 = d_wobble1 + dt * 3.5;
      d_y1 = d_y1 + drop_speed * 0.92 * frenzy_speed_mult * dt;
      d_x1 = d_x1 + Math.sin(d_wobble1) * 0.4;
      d_wobble2 = d_wobble2 + dt * 4.5;
      d_y2 = d_y2 + drop_speed * 0.88 * frenzy_speed_mult * dt;
      d_x2 = d_x2 + Math.sin(d_wobble2) * 0.6;
      d_wobble3 = d_wobble3 + dt * 3.0;
      d_y3 = d_y3 + drop_speed * 1.04 * frenzy_speed_mult * dt;
      d_x3 = d_x3 + Math.sin(d_wobble3) * 0.5;
    }
    if (d_x0 < 10.0) {
      d_x0 = 10.0;
    }
    if (d_x0 > 380.0) {
      d_x0 = 380.0;
    }
    if (d_x1 < 10.0) {
      d_x1 = 10.0;
    }
    if (d_x1 > 380.0) {
      d_x1 = 380.0;
    }
    if (d_x2 < 10.0) {
      d_x2 = 10.0;
    }
    if (d_x2 > 380.0) {
      d_x2 = 380.0;
    }
    if (d_x3 < 10.0) {
      d_x3 = 10.0;
    }
    if (d_x3 > 380.0) {
      d_x3 = 380.0;
    }
    if (level >= 3.0) {
      if (obs_active == false) {
        if (obs_y < -400.0) {
          if (Math.random() < 0.005) {
            obs_x = random_x();
            obs_y = -40.0;
            obs_active = true;
            obs_type = Math.floor(Math.random() * 3.0);
          }
        }
      }
      if (obs_active) {
        obs_y = obs_y + drop_speed * 0.7 * dt;
        if (obs_y > 510.0) {
          obs_active = false;
          obs_y = -600.0;
        }
      }
    }
    if (pow_active == false) {
      if (pow_y < -400.0) {
        if (Math.random() < 0.003) {
          pow_x = random_x();
          pow_y = -40.0;
          pow_active = true;
          pow_type = Math.floor(Math.random() * 3.0);
        }
      }
    }
    if (pow_active) {
      pow_y = pow_y + drop_speed * 0.6 * dt;
      if (pow_y > 510.0) {
        pow_active = false;
        pow_y = -900.0;
      }
    }
    if (d_y0 + 24.0 > py) {
      if (d_x0 + 10.0 > px) {
        if (d_x0 - 10.0 < px + pw) {
          handle_drop_catch(d_v0, d_x0, py);
          spawn_splash(d_x0, py, drop_color(d_v0));
          d_x0 = random_x();
          d_y0 = -40.0;
          d_v0 = random_value();
        }
      }
    }
    if (d_y0 > py + ph) {
      if (d_y0 < py + ph + 15.0) {
        const dist0 = abs_val(d_x0 - (px + pw / 2.0));
        if (dist0 < pw + 20.0) {
          near_miss_timer = 0.8;
          near_miss_x = d_x0;
          push_notif("SO CLOSE!", "#ff3333", 0.8);
        }
      }
    }
    if (d_y0 > 520.0) {
      handle_drop_miss();
      d_x0 = random_x();
      d_y0 = -40.0;
      d_v0 = random_value();
    }
    if (d_y1 + 24.0 > py) {
      if (d_x1 + 10.0 > px) {
        if (d_x1 - 10.0 < px + pw) {
          handle_drop_catch(d_v1, d_x1, py);
          spawn_splash(d_x1, py, drop_color(d_v1));
          d_x1 = random_x();
          d_y1 = -40.0 - Math.random() * 100.0;
          d_v1 = random_value();
        }
      }
    }
    if (d_y1 > py + ph) {
      if (d_y1 < py + ph + 15.0) {
        const dist1 = abs_val(d_x1 - (px + pw / 2.0));
        if (dist1 < pw + 20.0) {
          near_miss_timer = 0.8;
          near_miss_x = d_x1;
          push_notif("SO CLOSE!", "#ff3333", 0.8);
        }
      }
    }
    if (d_y1 > 520.0) {
      handle_drop_miss();
      d_x1 = random_x();
      d_y1 = -40.0 - Math.random() * 100.0;
      d_v1 = random_value();
    }
    if (d_y2 + 24.0 > py) {
      if (d_x2 + 10.0 > px) {
        if (d_x2 - 10.0 < px + pw) {
          handle_drop_catch(d_v2, d_x2, py);
          spawn_splash(d_x2, py, drop_color(d_v2));
          d_x2 = random_x();
          d_y2 = -40.0 - Math.random() * 150.0;
          d_v2 = random_value();
        }
      }
    }
    if (d_y2 > 520.0) {
      handle_drop_miss();
      d_x2 = random_x();
      d_y2 = -40.0 - Math.random() * 150.0;
      d_v2 = random_value();
    }
    if (d_y3 + 24.0 > py) {
      if (d_x3 + 10.0 > px) {
        if (d_x3 - 10.0 < px + pw) {
          handle_drop_catch(d_v3, d_x3, py);
          spawn_splash(d_x3, py, drop_color(d_v3));
          d_x3 = random_x();
          d_y3 = -40.0 - Math.random() * 200.0;
          d_v3 = random_value();
        }
      }
    }
    if (d_y3 > 520.0) {
      handle_drop_miss();
      d_x3 = random_x();
      d_y3 = -40.0 - Math.random() * 200.0;
      d_v3 = random_value();
    }
    if (obs_active) {
      if (obs_y + 26.0 > py) {
        if (obs_x + 26.0 > px) {
          if (obs_x < px + pw) {
            obs_active = false;
            obs_y = -600.0;
            if (obs_type == 0.0) {
              fill = fill - 10.0;
              if (fill < 0.0) {
                fill = 0.0;
              }
              __audio.sfxHit();
              shake = 2.0;
            }
            if (obs_type == 1.0) {
              frozen = true;
              freeze_timer = 1.5;
              __audio.sfxHit();
            }
            if (obs_type == 2.0) {
              fill = fill - 5.0;
              if (fill < 0.0) {
                fill = 0.0;
              }
              px = px - 50.0;
              if (px < 0.0) {
                px = 0.0;
              }
              __audio.sfxHit();
              shake = 3.0;
            }
          }
        }
      }
    }
    if (pow_active) {
      if (pow_y + 28.0 > py) {
        if (pow_x + 28.0 > px) {
          if (pow_x < px + pw) {
            pow_active = false;
            pow_y = -900.0;
            __audio.sfxPowerup();
            shake = 2.0;
            powerup_flash_timer = 0.2;
            if (pow_type == 0.0) {
              pw = 140.0;
              wide_timer = 5.0;
              powerup_flash_color = "#2ecc71";
            }
            if (pow_type == 1.0) {
              pepper_rush = true;
              rush_timer = 3.0;
              powerup_flash_color = "#ffd700";
            }
            if (pow_type == 2.0) {
              shield = true;
              powerup_flash_color = "#9b59b6";
            }
          }
        }
      }
    }
    if (level_timer <= 0.0) {
      level_fill_snap = fill;
      level_stars = 1.0;
      if (fill > 50.0) {
        level_stars = 2.0;
      }
      if (fill > 80.0) {
        level_stars = 3.0;
      }
      level = level + 1.0;
      __audio.sfxLevelup();
      shake = 3.0;
      game_state = 4.0;
      level_complete_timer = 2.0;
    }
  }
  let shk_x = 0.0;
  let shk_y = 0.0;
  if (shake > 0.0) {
    shk_x = (Math.random() - 0.5) * shake * 4.0;
    shk_y = (Math.random() - 0.5) * shake * 4.0;
  }
  __ctx.save();
  __ctx.translate(shk_x, shk_y);
  draw_background();
  if (combo >= 5.0) {
    const pulse_a = Math.sin(anim_time * 8.0) * 0.03;
    (() => { __ctx.fillStyle = "rgba(139,0,35,0.05)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (pepper_rush) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.08)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (jackpot_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.25)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (powerup_flash_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.15)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (combo_broken_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(0,0,0,0.2)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  draw_drop_trail(d_x0, d_y0, drop_color(d_v0));
  draw_drop_trail(d_x1, d_y1, drop_color(d_v1));
  draw_drop_trail(d_x2, d_y2, drop_color(d_v2));
  draw_drop_trail(d_x3, d_y3, drop_color(d_v3));
  let g0 = false;
  if (d_v0 >= 10.0) {
    g0 = true;
  }
  if (pepper_rush) {
    g0 = true;
  }
  let c0 = drop_color(d_v0);
  if (pepper_rush) {
    c0 = "#ffd700";
  }
  draw_teardrop(d_x0, d_y0, 10.0, c0, g0);
  if (d_v0 >= 5.0) {
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    const v0d = d_v0;
    __ctx.fillText(`${v0d}x`, d_x0 - 8.0, d_y0 + 22.0);
  }
  let g1 = false;
  if (d_v1 >= 10.0) {
    g1 = true;
  }
  if (pepper_rush) {
    g1 = true;
  }
  let c1 = drop_color(d_v1);
  if (pepper_rush) {
    c1 = "#ffd700";
  }
  draw_teardrop(d_x1, d_y1, 10.0, c1, g1);
  if (d_v1 >= 5.0) {
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    const v1d = d_v1;
    __ctx.fillText(`${v1d}x`, d_x1 - 8.0, d_y1 + 22.0);
  }
  let g2 = false;
  if (d_v2 >= 10.0) {
    g2 = true;
  }
  if (pepper_rush) {
    g2 = true;
  }
  let c2 = drop_color(d_v2);
  if (pepper_rush) {
    c2 = "#ffd700";
  }
  draw_teardrop(d_x2, d_y2, 10.0, c2, g2);
  if (d_v2 >= 5.0) {
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    const v2d = d_v2;
    __ctx.fillText(`${v2d}x`, d_x2 - 8.0, d_y2 + 22.0);
  }
  let g3 = false;
  if (d_v3 >= 10.0) {
    g3 = true;
  }
  if (pepper_rush) {
    g3 = true;
  }
  let c3 = drop_color(d_v3);
  if (pepper_rush) {
    c3 = "#ffd700";
  }
  draw_teardrop(d_x3, d_y3, 10.0, c3, g3);
  if (d_v3 >= 5.0) {
    (() => { __ctx.fillStyle = "#fff"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    const v3d = d_v3;
    __ctx.fillText(`${v3d}x`, d_x3 - 8.0, d_y3 + 22.0);
  }
  if (obs_active) {
    draw_obstacle(obs_x, obs_y, obs_type);
  }
  if (pow_active) {
    draw_powerup(pow_x, pow_y, pow_type, pow_spin);
  }
  if (wp_active) {
    draw_weapon_pickup(wp_x, wp_y, wp_type, wp_spin);
  }
  if (l_active0) {
    draw_laser_beam(l_x0, l_y0, l_ang0);
  }
  if (l_active1) {
    draw_laser_beam(l_x1, l_y1, l_ang1);
  }
  if (l_active2) {
    draw_laser_beam(l_x2, l_y2, l_ang2);
  }
  if (mb_active) {
    draw_mega_blast(mb_x, mb_y, mb_radius);
  }
  if (shield_burst) {
    const sbcx = px + pw / 2.0;
    const sbcy = py + ph / 2.0;
    draw_shield_burst_ring(sbcx, sbcy, shield_burst_radius);
  }
  if (freeze_tint_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(50,100,255,0.15)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (frozen_drops) {
    (() => { __ctx.fillStyle = "rgba(100,220,255,0.4)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x0 + 8.0, d_y0 - 5.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x0 - 6.0, d_y0 + 3.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x0 + 3.0, d_y0 + 8.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x1 + 7.0, d_y1 - 4.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x1 - 5.0, d_y1 + 4.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x1 + 2.0, d_y1 + 7.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x2 + 6.0, d_y2 - 6.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x2 - 7.0, d_y2 + 2.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x2 + 4.0, d_y2 + 9.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x3 + 8.0, d_y3 - 3.0, 3.0, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x3 - 4.0, d_y3 + 5.0, 2.5, 0, 2 * Math.PI); __ctx.fill(); })();
    (() => { __ctx.beginPath(); __ctx.arc(d_x3 + 5.0, d_y3 + 6.0, 2.0, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  draw_hit_explosion();
  draw_splash_particles();
  draw_frenzy_particles();
  draw_dr_pepper_can(px, py, pw, ph, frozen, pepper_rush, shield);
  if (wide_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(46,204,113,0.8)"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    const wt = Math.floor(wide_timer);
    __ctx.fillText(`WIDE ${wt}s`, px + 5.0, py - 8.0);
  }
  if (frozen) {
    (() => { __ctx.fillStyle = "rgba(129,212,250,0.8)"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    __ctx.fillText("FROZEN!", px + 5.0, py - 8.0);
  }
  if (near_miss_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(255,0,0,0.06)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (bonus_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.15)"; })();
    __ctx.fillRect(0.0, 0.0, 400.0, 500.0);
  }
  if (lucky_timer > 0.0) {
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.3)"; })();
    (() => { __ctx.beginPath(); __ctx.arc(200.0, 190.0, 40.0, 0, 2 * Math.PI); __ctx.fill(); })();
  }
  if (double_pts_timer > 0.0) {
    const dpt = Math.floor(double_pts_timer);
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.7)"; })();
    (() => { __ctx.font = "bold 11px Arial"; })();
    __ctx.fillText(`2x POINTS ${dpt}s`, 5.0, 475.0);
  }
  if (float_score_timer > 0.0) {
    const fs_alpha = float_score_timer;
    const fs_rise = (1.0 - float_score_timer) * 40.0;
    const fsv = Math.floor(float_score_val);
    (() => { __ctx.fillStyle = "#ffd700"; })();
    (() => { __ctx.font = "bold 16px Arial"; })();
    __ctx.fillText(`+${fsv}`, float_score_x - 15.0, float_score_y - 20.0 - fs_rise);
  }
  if (lives == 1.0) {
    if (game_state == 1.0) {
      const dp = Math.sin(danger_pulse);
      if (dp > 0.0) {
        (() => { __ctx.fillStyle = "#ff0000"; })();
        (() => { __ctx.font = "bold 14px Arial"; })();
        __ctx.fillText("DANGER!", 170.0, 475.0);
      }
    }
  }
  (() => { __ctx.fillStyle = "rgba(0,0,0,0.6)"; })();
  __ctx.fillRect(0.0, 0.0, 360.0, 35.0);
  (() => { __ctx.fillStyle = "#ffffff"; })();
  (() => { __ctx.font = "bold 18px Arial"; })();
  const score_hud = Math.floor(score);
  __ctx.fillText(`${score_hud}`, 10.0, 24.0);
  (() => { __ctx.fillStyle = "#c9a832"; })();
  (() => { __ctx.font = "bold 12px Arial"; })();
  const level_hud = Math.floor(level);
  const timer_hud = Math.floor(level_timer);
  __ctx.fillText(`Lv.${level_hud} | ${timer_hud}s`, 285.0, 24.0);
  draw_hearts();
  if (combo > 1.0) {
    const combo_d = Math.floor(combo);
    const mult = combo_multiplier();
    let base_size = 14.0 + combo * 1.3;
    if (base_size > 40.0) {
      base_size = 40.0;
    }
    const font_size = base_size * combo_scale;
    const fs = Math.floor(font_size);
    let combo_color = "#ffffff";
    if (combo >= 5.0) {
      combo_color = "#ffff00";
    }
    if (combo >= 10.0) {
      combo_color = "#ff8800";
    }
    if (combo >= 15.0) {
      combo_color = "#ff3300";
    }
    if (combo >= 20.0) {
      const rainbow_phase = Math.sin(anim_time * 10.0);
      if (rainbow_phase > 0.33) {
        combo_color = "#ff0066";
      }
      if (rainbow_phase > -0.33) {
        if (rainbow_phase <= 0.33) {
          combo_color = "#00ffcc";
        }
      }
      if (rainbow_phase <= -0.33) {
        combo_color = "#ffdd00";
      }
    }
    (() => { __ctx.fillStyle = combo_color; })();
    (() => { __ctx.font = `bold ${fs}px Arial`; })();
    __ctx.fillText(`${combo_d}x COMBO!`, 110.0, 60.0);
    if (mult > 1.0) {
      (() => { __ctx.fillStyle = "#ff6b35"; })();
      (() => { __ctx.font = "bold 12px Arial"; })();
      __ctx.fillText(`${mult}x MULTIPLIER`, 125.0, 78.0);
    }
  }
  draw_notifications(dt);
  draw_fill_meter(fill);
  if (pepper_rush) {
    const rt = Math.floor(rush_timer);
    (() => { __ctx.fillStyle = "rgba(255,215,0,0.7)"; })();
    (() => { __ctx.font = "bold 11px Arial"; })();
    __ctx.fillText(`RUSH ${rt}s`, 5.0, 435.0);
  }
  if (shield) {
    (() => { __ctx.fillStyle = "rgba(155,89,182,0.7)"; })();
    (() => { __ctx.font = "bold 10px Arial"; })();
    __ctx.fillText("SHIELD", 5.0, 460.0);
  }
  const fake_d = Math.floor(fake_catches);
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.25)"; })();
  (() => { __ctx.font = "10px Arial"; })();
  __ctx.fillText(`${fake_d} drops caught today`, 130.0, 498.0);
  const xp_pct = xp_bar / 20.0;
  (() => { __ctx.fillStyle = "rgba(255,255,255,0.1)"; })();
  __ctx.fillRect(0.0, 494.0, 400.0, 6.0);
  (() => { __ctx.fillStyle = "rgba(201,168,50,0.5)"; })();
  __ctx.fillRect(0.0, 494.0, xp_pct * 400.0, 6.0);
  if (muted) {
    (() => { __ctx.fillStyle = "rgba(255,255,255,0.4)"; })();
    (() => { __ctx.font = "10px Arial"; })();
    __ctx.fillText("MUTED (M)", 5.0, 445.0);
  }
  draw_weapon_hud();
  __ctx.restore();
}

function main() {
  (() => { __canvas.width = 400; __canvas.height = 500; })();
  console.log("Dr Pepper: Catch the Drop!");
  console.log("Arrow keys / WASD / mouse / touch to move");
  console.log("M = Mute | ESC = Pause");
  (function __animLoop() { frame(); requestAnimationFrame(__animLoop); })();
}
