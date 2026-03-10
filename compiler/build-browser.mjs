import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: '../website/playground/cbang-compiler.js',
  format: 'iife',
  globalName: 'CBang',
  platform: 'browser',
  target: 'es2020',
  minify: false,
});

console.log('Built website/playground/cbang-compiler.js');
