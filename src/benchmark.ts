import { bench, run } from "mitata";
import type { BundlerOptions } from "./bundlers/BundlerOptions";
import { build as buildRslib } from "./bundlers/rslib";
import { build as buildTsdown } from "./bundlers/tsdown";
import { build as buildTsup } from "./bundlers/tsup";
import { build as buildUnbuild } from "./bundlers/unbuild";
import { type BenchmarkResults, MetricsUtil } from "./util/MetricsUtil";
import { build as buildBunup } from "./bundlers/bunup";

// Define bundlers declaratively
const bundlers = [
	{
		name: "unbuild",
		build: buildUnbuild,
		bundlerOptions: {},
	},
	{
		name: "tsup",
		build: buildTsup,
		bundlerOptions: {},
	},
	{
		name: "tsdown",
		build: buildTsdown,
		bundlerOptions: {},
	},
	{
		name: "rslib",
		build: buildRslib,
		bundlerOptions: {},
	},
	{
		name: "bunup",
		build: buildBunup,
		bundlerOptions: {},
	},
];

interface FeatureOptions {
	name: string;
	project: string;
	bundlerOptions?: BundlerOptions;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	alterBundlerArray?: (bundlers: any[]) => any[];
}
const features: FeatureOptions[] = [
	{
		name: "default",
		project: "thousand-functions",
		bundlerOptions: {},
	},
	{
		name: "cjs",
		project: "thousand-functions",
		bundlerOptions: {
			cjs: true,
		},
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
		alterBundlerArray: (bundlers) => {
			// Modify the name of the existing tsdown entry
			const alteredBundlers = bundlers.map((bundler) => {
				if (bundler.name === "tsdown") {
					return {
						...bundler,
						name: "tsdown (oxc)",
					};
				}
				return bundler;
			});
			// Duplicate the tsdown to test tsc usage
			alteredBundlers.push({
				name: "tsdown (tsc)",
				build: buildTsdown,
				bundlerOptions: {
					isolatedDeclarations: false,
				},
			});
			return alteredBundlers;
		},
	},
];

const benchmark = async () => {
	// Create the metrics object
	const benchmarkResults: BenchmarkResults = {};

	for (const feature of features) {
		// Initialize the map for the project
		benchmarkResults[feature.name] = {};

		// Use the original bundler if no alteration is needed
		let bundlersToUse = bundlers;
		// Check if alterBundlerArray is defined and apply it
		if (feature.alterBundlerArray) {
			bundlersToUse = feature.alterBundlerArray(bundlers);
		}

		// Add the build functions to the benchmark suite using the bundlers array
		for (const bundler of bundlersToUse) {
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
