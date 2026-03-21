/**
 * Sprite & Entity runtime — injected into execution context.
 * Provides __entity object for sprite management, collision, and object pools.
 */
export const SPRITE_RUNTIME = `
var __entity = (function() {
  var sprites = {};
  var pools = {};

  function getSprite(id) {
    if (!sprites[id]) throw new Error('Sprite not found: ' + id);
    return sprites[id];
  }

  return {
    create: function(id, x, y, w, h) {
      sprites[id] = { x: x, y: y, w: w, h: h, color: '#fff', visible: true,
        image: null, sheet: null, frame: 0, rotation: 0, scaleX: 1, scaleY: 1,
        opacity: 1, groups: [] };
    },
    setPos: function(id, x, y) { var s = getSprite(id); s.x = x; s.y = y; },
    setSize: function(id, w, h) { var s = getSprite(id); s.w = w; s.h = h; },
    setColor: function(id, c) { getSprite(id).color = c; },
    setVisible: function(id, v) { getSprite(id).visible = v; },
    getX: function(id) { return getSprite(id).x; },
    getY: function(id) { return getSprite(id).y; },
    getW: function(id) { return getSprite(id).w; },
    getH: function(id) { return getSprite(id).h; },
    destroy: function(id) { delete sprites[id]; },

    loadImage: function(id, url) {
      var s = getSprite(id);
      var img = new Image();
      img.src = url;
      s.image = img;
    },
    setSheet: function(id, fw, fh, cols) {
      getSprite(id).sheet = { fw: fw, fh: fh, cols: cols };
    },
    setFrame: function(id, f) { getSprite(id).frame = f; },
    setRotation: function(id, a) { getSprite(id).rotation = a; },
    setScale: function(id, sx, sy) { var s = getSprite(id); s.scaleX = sx; s.scaleY = sy; },
    setOpacity: function(id, a) { getSprite(id).opacity = a; },

    draw: function(id) {
      var s = getSprite(id);
      if (!s.visible) return;
      __ctx.save();
      __ctx.globalAlpha = s.opacity;
      __ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
      __ctx.rotate(s.rotation);
      __ctx.scale(s.scaleX, s.scaleY);
      if (s.image && s.image.complete) {
        if (s.sheet) {
          var col = s.frame % s.sheet.cols;
          var row = Math.floor(s.frame / s.sheet.cols);
          __ctx.drawImage(s.image, col * s.sheet.fw, row * s.sheet.fh,
            s.sheet.fw, s.sheet.fh, -s.w / 2, -s.h / 2, s.w, s.h);
        } else {
          __ctx.drawImage(s.image, -s.w / 2, -s.h / 2, s.w, s.h);
        }
      } else {
        __ctx.fillStyle = s.color;
        __ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
      }
      __ctx.restore();
    },
    drawAll: function() {
      var ids = Object.keys(sprites);
      for (var i = 0; i < ids.length; i++) {
        var s = sprites[ids[i]];
        if (s.visible) __entity.draw(ids[i]);
      }
    },

    collidesRect: function(a, b) {
      var sa = getSprite(a), sb = getSprite(b);
      return sa.x < sb.x + sb.w && sa.x + sa.w > sb.x &&
             sa.y < sb.y + sb.h && sa.y + sa.h > sb.y;
    },
    collidesPoint: function(id, px, py) {
      var s = getSprite(id);
      return px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h;
    },
    collidesCircle: function(a, b) {
      var sa = getSprite(a), sb = getSprite(b);
      var ax = sa.x + sa.w / 2, ay = sa.y + sa.h / 2, ar = sa.w / 2;
      var bx = sb.x + sb.w / 2, by = sb.y + sb.h / 2, br = sb.w / 2;
      var dx = ax - bx, dy = ay - by;
      return Math.sqrt(dx * dx + dy * dy) < ar + br;
    },
    collisionGroup: function(id, group) {
      var s = getSprite(id);
      if (s.groups.indexOf(group) === -1) s.groups.push(group);
    },
    checkGroupCollisions: function(ga, gb, cb) {
      var idsA = [], idsB = [];
      var ids = Object.keys(sprites);
      for (var i = 0; i < ids.length; i++) {
        if (sprites[ids[i]].groups.indexOf(ga) !== -1) idsA.push(ids[i]);
        if (sprites[ids[i]].groups.indexOf(gb) !== -1) idsB.push(ids[i]);
      }
      for (var a = 0; a < idsA.length; a++) {
        for (var b = 0; b < idsB.length; b++) {
          if (idsA[a] !== idsB[b] && __entity.collidesRect(idsA[a], idsB[b])) {
            cb(idsA[a], idsB[b]);
          }
        }
      }
    },

    poolCreate: function(name, max) {
      var entities = [];
      var free = [];
      for (var i = 0; i < max; i++) {
        var id = name + '_' + i;
        sprites[id] = { x: 0, y: 0, w: 0, h: 0, color: '#fff', visible: false,
          image: null, sheet: null, frame: 0, rotation: 0, scaleX: 1, scaleY: 1,
          opacity: 1, groups: [] };
        entities.push(id);
        free.push(id);
      }
      pools[name] = { entities: entities, free: free, active: [] };
    },
    poolSpawn: function(name) {
      var p = pools[name];
      if (!p || p.free.length === 0) return null;
      var id = p.free.pop();
      p.active.push(id);
      sprites[id].visible = true;
      return id;
    },
    poolRecycle: function(name, id) {
      var p = pools[name];
      if (!p) return;
      var idx = p.active.indexOf(id);
      if (idx !== -1) {
        p.active.splice(idx, 1);
        p.free.push(id);
        sprites[id].visible = false;
      }
    },
    poolForEach: function(name, cb) {
      var p = pools[name];
      if (!p) return;
      for (var i = 0; i < p.active.length; i++) {
        cb(p.active[i]);
      }
    },
  };
})();
`;
