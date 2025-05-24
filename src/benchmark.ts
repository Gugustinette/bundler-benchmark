import { bench, run } from "mitata";
import { build as buildRslib } from "./bundlers/rslib";
import { build as buildTsdown } from "./bundlers/tsdown";
import { build as buildTsup } from "./bundlers/tsup";
import { build as buildUnbuild } from "./bundlers/unbuild";
import { type BarChartMetrics, MetricsUtil } from "./util/MetricsUtil";

// Define bundlers declaratively
const bundlers = [
	{
		name: "unbuild",
		build: buildUnbuild,
	},
	{
		name: "tsup",
		build: buildTsup,
	},
	{
		name: "tsdown (oxc)",
		build: buildTsdown,
	},
	{
		name: "tsdown (tsc)",
		build: buildTsdown,
		bundlerOptions: {
			isolatedDeclarations: false,
		},
	},
	{
		name: "rslib",
		build: buildRslib,
	},
];

const projects = [
	{
		name: "thousand-functions",
		bundlerOptions: {},
	},
	{
		name: "thousand-typed-functions",
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

		// Add the build functions to the benchmark suite using the bundlers array
		for (const bundler of bundlers) {
			bench(`${project.name}@${bundler.name}`, async () => {
				await bundler.build({
					project: project.name,
					...project.bundlerOptions,
					...bundler.bundlerOptions,
				});
			});
		}
	}

	// Run the benchmark
	const results = await run();

	// Convert the results to the custom metrics object
	results.benchmarks.forEach((benchmark) => {
		const name = benchmark.alias;
		const projectName = name.split("@")[0];
		const bundlerName = name.split("@")[1];
		if (benchmark.runs.length > 0) {
			const run = benchmark.runs[0];
			const averageExecutionTime = run.stats?.avg ?? 0; // Execution time in nanoseconds
			const averageHeapUsage = run.stats?.heap?.avg ?? 0; // Heap usage in bytes
			if (executionTimeMetrics[projectName]) {
				executionTimeMetrics[projectName][bundlerName] =
					averageExecutionTime / 1e6; // Convert to milliseconds
			}
			if (heapUsageMetrics[projectName]) {
				heapUsageMetrics[projectName][bundlerName] =
					averageHeapUsage / 1024 / 1024; // Convert to megabytes
			}
		}
	});

	// Log the metrics to the console
	MetricsUtil.logMetrics(
		"Execution Time Benchmark",
		"ms",
		executionTimeMetrics,
	);
	MetricsUtil.logMetrics("Heap Usage Benchmark", "MB", heapUsageMetrics);

	// Save the SVG chart to a file
	MetricsUtil.saveMetricsToJson(
		executionTimeMetrics,
		"docs/public/results/bundler-execution-time-comparison.json",
	);
	console.log(
		"JSON data saved to docs/public/results/bundler-execution-time-comparison.json",
	);
	MetricsUtil.saveMetricsToJson(
		heapUsageMetrics,
		"docs/public/results/bundler-heap-usage-comparison.json",
	);
	console.log(
		"JSON data saved to docs/public/results/bundler-heap-usage-comparison.json",
	);
};

benchmark().catch((err) => {
	console.error("Error during benchmark:", err);
});
