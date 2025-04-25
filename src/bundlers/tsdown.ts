import { build } from 'tsdown';

export const benchmark = async () => {
  // Build the thousand-functions project
  const projectDir = 'projects/thousand-functions';
  const entryFile = `${projectDir}/src/index.ts`;
  const outputDir = `${projectDir}/dist/tsdown`;

  // Start time for time measurement
  const startTime = process.hrtime.bigint();

  // Build the project
  await build({
    entry: entryFile,
    outDir: outputDir,
    format: 'esm',
    target: 'esnext',
    clean: true,
    sourcemap: true,
    minify: true,
    silent: true,
  });

  // End time for time measurement
  const endTime = process.hrtime.bigint();
  const durationInNs = endTime - startTime;
  const durationInMs = Number(durationInNs) / 1_000_000; // Convert nanoseconds to milliseconds
  console.log(`[tsdown]: Built project in ${durationInMs.toFixed(2)} ms`);
};
