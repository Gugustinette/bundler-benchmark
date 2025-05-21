import { build as buildRslib } from '@rslib/core';
import { BundlerOptions } from './BundlerOptions';

export const build = async (options: BundlerOptions) => {
  // Setup the project path
  const projectDir = `projects/${options.project}`;
  const entryFile = `${projectDir}/src/index.ts`;
  const outputDir = `${projectDir}/dist/rslib`;

  // Build the project
  await buildRslib({
    lib: [
      {
        source: {
          entry: {
            index: entryFile,
          },
          tsconfigPath: options.dts ? `${projectDir}/rslib.tsconfig.json` : undefined,
        },
        format: 'esm',
        syntax: ['node 18'],
        dts: options.dts,
        output: {
          minify: true,
          sourceMap: true,
          distPath: {
            root: outputDir,
          },
        },
      },
    ],
  });
};
