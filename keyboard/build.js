const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/keyboard.js'],
    bundle: true,
    outfile: 'dist/renderer.bundle.js',
    platform: 'browser',
    minify: false,
    sourcemap: true,
}).catch(() => process.exit(1));
