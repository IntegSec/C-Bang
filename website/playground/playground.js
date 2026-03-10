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

function executeCompiledJs(jsCode) {
  // This function runs user-authored C! code that was compiled to JS.
  // It is intentional — this is a playground for the user's own code.
  var fn = new Function(jsCode);  // eslint-disable-line no-new-func
  fn();
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

  // Execute with captured console.log
  var logs = [];
  var origLog = console.log;
  var origWarn = console.warn;
  var origError = console.error;
  console.log = function () {
    var args = Array.prototype.slice.call(arguments);
    logs.push(args.join(' '));
  };
  console.warn = function () {
    var args = Array.prototype.slice.call(arguments);
    logs.push('[warn] ' + args.join(' '));
  };
  console.error = function () {
    var args = Array.prototype.slice.call(arguments);
    logs.push('[error] ' + args.join(' '));
  };

  try {
    var execCode = result.js;
    // Auto-call main() if defined
    if (execCode.indexOf('function main(') !== -1) {
      execCode += '\nmain();';
    }
    executeCompiledJs(execCode);
    consoleOutput.textContent = logs.join('\n') || '(no output)';
    consoleOutput.className = 'pg-output success';
  } catch (e) {
    var logText = logs.length > 0 ? logs.join('\n') + '\n' : '';
    consoleOutput.textContent = logText + 'Runtime error: ' + e.message;
    consoleOutput.className = 'pg-output error';
  } finally {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  }
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
