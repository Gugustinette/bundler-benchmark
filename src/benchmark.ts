import { bench, run } from "mitata";
import { build as buildRslib } from "./bundlers/rslib";
import { build as buildTsdown } from "./bundlers/tsdown";
import { build as buildTsup } from "./bundlers/tsup";
import { build as buildUnbuild } from "./bundlers/unbuild";
import { type BenchmarkResults, MetricsUtil } from "./util/MetricsUtil";
import type { BundlerOptions } from "./bundlers/BundlerOptions";

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

interface FeatureOptions {
	name: string;
	project: string;
	bundlerOptions?: BundlerOptions;
}
const features: FeatureOptions[] = [
	{
		name: "default",
		project: "thousand-functions",
		bundlerOptions: {},
	},
	{
		name: "minify",
		project: "thousand-functions",
		bundlerOptions: {
			minify: true,
		},
	},
	{
		name: "sourcemap",
		project: "thousand-functions",
		bundlerOptions: {
			sourcemap: true,
		},
	},
	{
		name: "dts",
		project: "thousand-functions",
		bundlerOptions: {
			dts: true,
		},
	},
];

const benchmark = async () => {
	// Create the metrics object
	const benchmarkResults: BenchmarkResults = {};

	for (const feature of features) {
		// Initialize the map for the project
		benchmarkResults[feature.name] = {};

		// Add the build functions to the benchmark suite using the bundlers array
		for (const bundler of bundlers) {
			bench(`${feature.name}@${bundler.name}`, async () => {
				await bundler.build({
					project: feature.project,
					...feature.bundlerOptions,
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
		const featureName = name.split("@")[0];
		const bundlerName = name.split("@")[1];
		if (benchmark.runs.length > 0) {
			const run = benchmark.runs[0];
			const averageExecutionTime = run.stats?.avg ?? 0; // Execution time in nanoseconds
			const averageHeapUsage = run.stats?.heap?.avg ?? 0; // Heap usage in bytes
			benchmarkResults[featureName][bundlerName] = {
				executionTime: averageExecutionTime / 1e6, // Convert to milliseconds
				heapUsage: averageHeapUsage / 1024 / 1024, // Convert to megabytes
			};
		}
	});

	// Log the metrics to the console
	MetricsUtil.logMetrics(benchmarkResults);

	// Save the SVG chart to a file
	MetricsUtil.saveMetricsToJson(
		benchmarkResults,
		"docs/public/results/benchmark-results.json",
	);
	console.log("JSON data saved to docs/public/results/benchmark-results.json");
};

benchmark().catch((err) => {
	console.error("Error during benchmark:", err);
});
