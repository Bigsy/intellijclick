const fs = require('fs');
const esbuild = require('esbuild');

const isWatchMode = process.argv.includes('--watch');

async function build() {
  try {
    const buildOptions = {
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'dist/index.js',
      external: ['vscode'],
      format: 'cjs',
      platform: 'node',
      sourcemap: false,
      minify: process.env.NODE_ENV === 'production',
    };

    if (isWatchMode) {
      buildOptions.watch = {
        onRebuild(error, result) {
          if (error) {
            console.error('Watch build failed:', error);
          } else {
            console.log('Watch build succeeded:', result);
          }
        },
      };
    }

    await esbuild.build(buildOptions);
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
