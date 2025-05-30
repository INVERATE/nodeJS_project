const esbuild = require('esbuild');

// Build pour le processus de rendu
esbuild.build({
    entryPoints: ['keyboard.js'],
    bundle: true,
    outfile: 'dist/renderer.bundle.js',
    platform: 'browser',
    target: ['chrome93'], // Cible une version de Chrome compatible avec Electron
    minify: false,
    sourcemap: true,
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    loader: {
        '.js': 'jsx',
    },
}).catch(() => process.exit(1));

// Build pour le preload
esbuild.build({
    entryPoints: ['preload.js'],
    bundle: true,
    outfile: 'dist/preload.bundle.js',
    platform: 'node',
    target: ['node14'],
    external: ['electron'],
    minify: false,
    sourcemap: true,
}).catch(() => process.exit(1));
