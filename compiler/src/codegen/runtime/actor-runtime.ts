/**
 * Actor model runtime — message queues, spawn, supervision.
 *
 * Each actor instance gets a mailbox (async queue).  Messages are
 * processed one at a time, which eliminates data races by construction.
 */
export const ACTOR_RUNTIME = `
var __actor = (function() {
  var actors = new Map();
  var nextId = 1;

  // ── Base class ────────────────────────────────────────────────
  function ActorRef(id, instance) {
    this.id = id;
    this.instance = instance;
    this.mailbox = [];
    this.processing = false;
    this.alive = true;
    this.supervisor = null;
    this.children = [];
  }

  ActorRef.prototype.send = function(messageName, args) {
    if (!this.alive) return;
    this.mailbox.push({ name: messageName, args: args || [] });
    if (!this.processing) this._drain();
  };

  ActorRef.prototype._drain = function() {
    var self = this;
    if (self.processing || !self.alive) return;
    self.processing = true;

    function next() {
      if (self.mailbox.length === 0 || !self.alive) {
        self.processing = false;
        return;
      }
      var msg = self.mailbox.shift();
      var handlerName = 'on' + msg.name;
      if (typeof self.instance[handlerName] === 'function') {
        try {
          var result = self.instance[handlerName].apply(self.instance, msg.args);
          if (result && typeof result.then === 'function') {
            result.then(next).catch(function(err) { self._fail(err, msg); next(); });
          } else {
            next();
          }
        } catch(err) {
          self._fail(err, msg);
          next();
        }
      } else {
        next();
      }
    }
    // yield to event loop so sends inside handlers don't stack overflow
    Promise.resolve().then(next);
  };

  ActorRef.prototype._fail = function(err, msg) {
    if (this.supervisor && typeof this.supervisor._onChildFailure === 'function') {
      this.supervisor._onChildFailure(this, err, msg);
    } else {
      console.error('[actor:' + this.id + '] unhandled error in on' + msg.name + ':', err);
    }
  };

  ActorRef.prototype.stop = function() {
    this.alive = false;
    this.mailbox = [];
    // stop children
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].stop();
    }
    actors.delete(this.id);
  };

  // ── Public API ────────────────────────────────────────────────

  function spawn(ActorClass, args, parentRef) {
    var id = nextId++;
    var instance = new (Function.prototype.bind.apply(ActorClass, [null].concat(args || [])));
    var ref = new ActorRef(id, instance);
    instance.__ref = ref;
    // convenience: instance.send(Name, args) delegates to its own ref
    instance.send = function(name, a) { ref.send(name, a); };
    // self reference
    instance.self = ref;
    actors.set(id, ref);

    if (parentRef) {
      ref.supervisor = parentRef;
      parentRef.children.push(ref);
    }

    return ref;
  }

  function send(ref, messageName, args) {
    if (ref && typeof ref.send === 'function') {
      ref.send(messageName, args || []);
    }
  }

  function supervise(parentRef, childRef, options) {
    if (!parentRef || !childRef) return;
    childRef.supervisor = parentRef;
    var restartPolicy = (options && options.restart) || 'never';
    var maxRestarts = (options && options.max_restarts) || 5;
    var restartCount = 0;

    parentRef._onChildFailure = function(failedRef, err, msg) {
      if (restartPolicy === 'always' && restartCount < maxRestarts) {
        restartCount++;
        console.warn('[supervisor] restarting actor:' + failedRef.id + ' (' + restartCount + '/' + maxRestarts + ')');
        // re-drain to continue processing
        failedRef.alive = true;
      } else if (restartPolicy === 'never') {
        console.error('[supervisor] actor:' + failedRef.id + ' failed permanently:', err);
        failedRef.stop();
      }
      if (options && typeof options.on_failure === 'function') {
        options.on_failure(failedRef.instance);
      }
    };
  }

  function stopAll() {
    actors.forEach(function(ref) { ref.stop(); });
    actors.clear();
    nextId = 1;
  }

  return {
    spawn: spawn,
    send: send,
    supervise: supervise,
    stopAll: stopAll,
    ActorRef: ActorRef
  };
})();
`;
