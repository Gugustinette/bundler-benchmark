import { build } from 'unbuild'

export const benchmark = async () => {
  // Build the thousand-functions project
  const projectDir = 'projects/thousand-functions';
  const entryFile = `src/index.ts`;
  const outputDir = `dist/unbuild`;

  // Start time for time measurement
  const startTime = process.hrtime.bigint();

  // Build the project
  await build(projectDir, false, {
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

  // End time for time measurement
  const endTime = process.hrtime.bigint();
  const durationInNs = endTime - startTime;
  const durationInMs = Number(durationInNs) / 1_000_000; // Convert nanoseconds to milliseconds
  console.log(`[unbuild]: Built project in ${durationInMs.toFixed(2)} ms`);
};
