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
