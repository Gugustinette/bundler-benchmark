import { build as buildUnbuild } from 'unbuild'
import { BundlerOptions } from './BundlerOptions';

export const build = async (options: BundlerOptions) => {
  // Setup the project path
  const projectDir = `projects/${options.project}`;
  const entryFile = `src/index.ts`;
  const outputDir = `dist/unbuild`;

  // Build the project
  await buildUnbuild(projectDir, false, {
    entries: [entryFile],
    outDir: outputDir,
    clean: true,
    sourcemap: true,
    rollup: {
      emitCJS: false,
      esbuild: {
        minify: true,
        target: 'esnext',
        format: 'esm'
      }
    }
  });
};
