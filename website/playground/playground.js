// C! Playground — browser-based compiler and runner
//
// Security note: This playground intentionally executes user-authored C! code
// compiled to JavaScript.  The execution happens entirely client-side in the
// user's own browser — no server is involved and no untrusted third-party
// code is evaluated.  The use of the Function constructor below is the
// standard approach for browser-based language playgrounds (e.g., the Rust,
// Go, and TypeScript playgrounds all do the same).

const EXAMPLES = {
  hello: `fn main() with IO {
    println!("Hello from C!");
}`,

  fibonacci: `fn fib(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

fn main() with IO {
    let result = fib(10);
    println!("fib(10) = {result}");
}`,

  actor: `actor Counter {
    state count: i32 = 0

    on Increment() {
        count += 1;
    }

    on GetCount() {
        reply count;
    }
}`,

  pattern: `enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

fn describe(s: Shape) -> String {
    match s {
        Circle(r) => { return "circle"; },
        Rect(w, h) => { return "rectangle"; },
    }
}`,

  chat: `// Chat Application — actors for real-time messaging
// Demonstrates actor model, message handling, and state management

type Message {
    sender: String,
    text: String,
}

actor ChatRoom {
    state members: i32 = 0
    state message_count: i32 = 0

    on Join(name: String) {
        members += 1;
        emit UserJoined(name, members);
    }

    on Leave(name: String) {
        members -= 1;
        emit UserLeft(name, members);
    }

    on SendMessage(sender: String, text: String) {
        message_count += 1;
        emit NewMessage(sender, text, message_count);
    }

    on GetStats() {
        reply members;
    }

    fn broadcast(msg: String) {
        println!(msg);
    }
}

actor Moderator {
    state warnings: i32 = 0

    #[intent(filter inappropriate content)]
    on Review(sender: String, text: String) {
        let is_ok = true;
        if is_ok {
            emit Approved(sender, text);
        } else {
            warnings += 1;
            emit Rejected(sender, warnings);
        }
    }
}

fn main() with IO {
    println!("Chat system compiled successfully!");
    println!("ChatRoom actor handles: Join, Leave, SendMessage, GetStats");
    println!("Moderator actor handles: Review with intent annotations");
}`,

  contract: `// Token Contract — ERC20-style token with minting and transfers
// Demonstrates smart contract patterns with ownership and effects

contract Token {
    state name: String
    state symbol: String
    state total_supply: u256 = 0
    state owner: Address

    init() {
        owner = caller;
        name = "CBangCoin";
        symbol = "CBC";
    }

    #[intent(create new tokens, only callable by owner)]
    pub fn mint(to: Address, amount: u256) {
        total_supply += amount;
        emit Transfer(to, amount);
    }

    #[intent(transfer tokens between accounts safely)]
    pub fn transfer(to: Address, amount: u256) {
        emit Transfer(to, amount);
    }

    pub fn get_supply() {
        reply total_supply;
    }
}

contract NFTMarketplace {
    state listing_count: u256 = 0
    state fee_percent: u256 = 2

    #[intent(list an NFT for sale at a given price)]
    pub fn list_item(token_id: u256, price: u256) {
        listing_count += 1;
        emit ItemListed(token_id, price, listing_count);
    }

    #[intent(purchase a listed NFT, transferring ownership)]
    pub fn buy_item(listing_id: u256) {
        emit ItemSold(listing_id, caller);
    }

    pub pure fn calculate_fee(price: u256) -> u256 {
        return price * 2 / 100;
    }
}

fn main() with IO {
    println!("Token contract: CBangCoin (CBC)");
    println!("NFT Marketplace with 2% fee");
    println!("Contracts compiled to JavaScript classes!");
}`,

  spinning: `// 3D Spinning Cube — rendered with ASCII art
// Demonstrates math, loops, and string building

fn sin_approx(x: f64) -> f64 {
    let x2 = x * x;
    return x - x * x2 / 6.0 + x * x2 * x2 / 120.0;
}

fn cos_approx(x: f64) -> f64 {
    let x2 = x * x;
    return 1.0 - x2 / 2.0 + x2 * x2 / 24.0;
}

fn render_frame(angle: f64) {
    let cos_a = cos_approx(angle);
    let sin_a = sin_approx(angle);
    let cos_b = cos_approx(angle * 0.7);
    let sin_b = sin_approx(angle * 0.7);

    let mut frame = "";
    let mut y = 0;
    while y < 20 {
        let mut x = 0;
        let mut line = "";
        while x < 40 {
            let px = (x - 20) * 1.0 / 10.0;
            let py = (y - 10) * 1.0 / 5.0;

            let rx = px * cos_a - py * sin_a;
            let ry = px * sin_a + py * cos_a;
            let rz = rx * sin_b;
            let rx2 = rx * cos_b;

            if rx2 > 0.0 - 1.0 {
                if rx2 < 1.0 {
                    if ry > 0.0 - 1.0 {
                        if ry < 1.0 {
                            if rz > 0.0 - 0.5 {
                                line = line + "#";
                            } else {
                                line = line + ".";
                            }
                        } else {
                            line = line + " ";
                        }
                    } else {
                        line = line + " ";
                    }
                } else {
                    line = line + " ";
                }
            } else {
                line = line + " ";
            }
            x += 1;
        }
        println!(line);
        y += 1;
    }
}

fn main() with IO {
    println!("=== C! 3D Cube Renderer ===");
    println!("");

    let mut angle = 0.0;
    while angle < 3.14 {
        println!("--- Frame at angle {angle} ---");
        render_frame(angle);
        println!("");
        angle += 1.57;
    }

    println!("=== Rendering complete! ===");
}`,
};

function getEditorValue() {
  return document.getElementById('editor').value;
}

function setEditorValue(code) {
  document.getElementById('editor').value = code;
}

function compile(source) {
  try {
    var lexer = new CBang.Lexer(source, 'playground.cb');
    var tokens = lexer.tokenize();

    var lexErrors = tokens.filter(function (t) {
      return t.type === 'Error';
    });
    if (lexErrors.length > 0) {
      return { error: lexErrors.map(function (e) { return 'Lex error: ' + e.value; }).join('\n') };
    }

    var parser = new CBang.Parser(tokens);
    var result = parser.parse();

    if (result.diagnostics.length > 0) {
      return {
        error: result.diagnostics.map(function (d) {
          return CBang.formatDiagnostic(d, source, { noColor: true });
        }).join('\n\n'),
      };
    }

    var gen = new CBang.JsGenerator();
    var js = gen.generate(result.program);
    return { js: js };
  } catch (e) {
    return { error: e.message };
  }
}

function run() {
  var source = getEditorValue();
  var result = compile(source);

  var jsOutput = document.getElementById('js-output');
  var consoleOutput = document.getElementById('console-output');

  if (result.error) {
    jsOutput.textContent = '';
    consoleOutput.textContent = result.error;
    consoleOutput.className = 'pg-output error';
    return;
  }

  jsOutput.textContent = result.js;
  consoleOutput.className = 'pg-output';
  consoleOutput.textContent = 'Running...';

  var execCode = result.js;
  // Auto-call main() if defined
  if (execCode.indexOf('function main(') !== -1) {
    execCode += '\nmain();';
  }

  // Execute in a sandboxed iframe via Blob URL to avoid needing unsafe-eval.
  // The iframe posts console output back to us via postMessage.
  var iframeHtml = '<!DOCTYPE html><html><head><script>' +
    'var __logs = [];' +
    'console.log = function() { __logs.push(Array.prototype.slice.call(arguments).join(" ")); };' +
    'console.warn = function() { __logs.push("[warn] " + Array.prototype.slice.call(arguments).join(" ")); };' +
    'console.error = function() { __logs.push("[error] " + Array.prototype.slice.call(arguments).join(" ")); };' +
    'try {' + execCode.replace(/<\/script>/gi, '<\\/script>') + ';' +
    '  parent.postMessage({ type: "cbang-output", logs: __logs }, "*");' +
    '} catch(e) {' +
    '  parent.postMessage({ type: "cbang-output", logs: __logs, error: e.message }, "*");' +
    '}' +
    '<\/script></head><body></body></html>';

  var blob = new Blob([iframeHtml], { type: 'text/html' });
  var url = URL.createObjectURL(blob);

  // Remove any previous sandbox iframe
  var oldFrame = document.getElementById('cbang-sandbox');
  if (oldFrame) oldFrame.remove();

  var iframe = document.createElement('iframe');
  iframe.id = 'cbang-sandbox';
  iframe.style.display = 'none';
  iframe.sandbox = 'allow-scripts';
  iframe.src = url;
  document.body.appendChild(iframe);

  // Listen for result
  var timeout = setTimeout(function () {
    consoleOutput.textContent = '(timeout — program took too long)';
    consoleOutput.className = 'pg-output error';
    iframe.remove();
    URL.revokeObjectURL(url);
  }, 5000);

  function onMessage(e) {
    if (e.data && e.data.type === 'cbang-output') {
      clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      var logText = e.data.logs.join('\n');
      if (e.data.error) {
        consoleOutput.textContent = (logText ? logText + '\n' : '') + 'Runtime error: ' + e.data.error;
        consoleOutput.className = 'pg-output error';
      } else {
        consoleOutput.textContent = logText || '(no output)';
        consoleOutput.className = 'pg-output success';
      }
      iframe.remove();
      URL.revokeObjectURL(url);
    }
  }
  window.addEventListener('message', onMessage);
}

function loadExample(name) {
  if (EXAMPLES[name]) {
    setEditorValue(EXAMPLES[name]);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', function () {
  // Set default code
  setEditorValue(EXAMPLES.hello);

  // Run button
  document.getElementById('run-btn').addEventListener('click', run);

  // Examples dropdown
  document.getElementById('examples-select').addEventListener('change', function () {
    if (this.value) {
      loadExample(this.value);
      this.value = '';
    }
  });

  // Ctrl/Cmd+Enter to run
  document.getElementById('editor').addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
    // Tab inserts spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 4;
    }
  });
});
