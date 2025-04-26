import { build as buildUnbuild } from './bundlers/unbuild';
import { build as buildTsup } from './bundlers/tsup';
import { build as buildTsdown } from './bundlers/tsdown';
import { BarChartMetrics, MetricsUtil } from './util/MetricsUtil';
import { bench, run } from 'mitata';

const projects = [
  {
    name: 'thousand-functions',
    bundlerOptions: {}
  },
  {
    name: 'thousand-typed-functions',
    bundlerOptions: {
      dts: true,
    },
  },
];

const benchmark = async () => {
  // Create the metrics objects
  const executionTimeMetrics: BarChartMetrics = {};
  const heapUsageMetrics: BarChartMetrics = {};

  for (const project of projects) {
    // Initialize the map for the project
    executionTimeMetrics[project.name] = {};
    heapUsageMetrics[project.name] = {};

    // Add the build functions to the benchmark suite
    bench(`${project.name}@unbuild`, async () => {
      await buildUnbuild({
        project: project.name,
        ...project.bundlerOptions,
      });
    });
    bench(`${project.name}@tsup`, async () => {
      await buildTsup({
        project: project.name,
        ...project.bundlerOptions,
      });
    });
    bench(`${project.name}@tsdown`, async () => {
      await buildTsdown({
        project: project.name,
        ...project.bundlerOptions,
      });
    });
  }

  // Run the benchmark
  const results = await run();

  // Convert the results to the custom metrics object
  results.benchmarks.forEach((benchmark) => {
    const name = benchmark.alias;
    const projectName = name.split('@')[0];
    const bundlerName = name.split('@')[1];
    if (benchmark.runs.length > 0) {
      const run = benchmark.runs[0];
      const averageExecutionTime = run.stats?.avg ?? 0 // Execution time in nanoseconds
      const averageHeapUsage = run.stats?.heap?.avg ?? 0; // Heap usage in bytes
      if (executionTimeMetrics[projectName]) {
        executionTimeMetrics[projectName][bundlerName] = averageExecutionTime / 1e6; // Convert to milliseconds
      }
      if (heapUsageMetrics[projectName]) {
        heapUsageMetrics[projectName][bundlerName] = averageHeapUsage / 1024 / 1024; // Convert to megabytes
      }
    }
  });

  // Log the metrics to the console
  MetricsUtil.logMetrics("Execution Time Benchmark", "ms", executionTimeMetrics);
  MetricsUtil.logMetrics("Heap Usage Benchmark", "MB", heapUsageMetrics);

  // Generate the SVG chart
  const executionTimeSvgChart = MetricsUtil.generateBarChart(executionTimeMetrics, {
    title: "Execution Time Benchmark (less is better)",
    yAxisLabel: "Execution Time (ms)",
    width: 900,
    height: 600,
    formatValue: (value) => `${value.toFixed(0)} ms`,
  });
  const heapUsageSvgChart = MetricsUtil.generateBarChart(heapUsageMetrics, {
    title: "Heap Usage Benchmark (less is better)",
    yAxisLabel: "Heap Usage (MB)",
    width: 900,
    height: 600,
    formatValue: (value) => `${value.toFixed(0)} MB`,
  });

  // Save the SVG chart to a file
  MetricsUtil.saveSvgToFile(executionTimeSvgChart, 'results/bundler-execution-time-comparison.svg');
  console.log('SVG chart saved to results/bundler-execution-time-comparison.svg');
  MetricsUtil.saveSvgToFile(heapUsageSvgChart, 'results/bundler-heap-usage-comparison.svg');
  console.log('SVG chart saved to results/bundler-heap-usage-comparison.svg');
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
