import { bench, run } from "mitata";
import type { BundlerOptions } from "./bundlers/BundlerOptions";
import { build as buildRslib } from "./bundlers/rslib";
import { build as buildTsdown } from "./bundlers/tsdown";
import { build as buildTsup } from "./bundlers/tsup";
import { build as buildUnbuild } from "./bundlers/unbuild";
import { type BenchmarkResults, MetricsUtil } from "./util/MetricsUtil";
import { build as buildBunup } from "./bundlers/bunup";

// Define projects declaratively
interface ProjectOptions {
	name: string;
	bundlerOptions?: BundlerOptions;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	alterBundlerArray?: (bundlers: any[]) => any[];
}
const projects: ProjectOptions[] = [
	/*
	{
		name: "thousand-functions",
	},
	*/
	{
		name: "rxjs",
		bundlerOptions: {
			entries: [
				"packages/observable/src/index.ts",
				"packages/rxjs/src/index.ts",
			],
			external: ["@rxjs/observable"],
		},
		alterBundlerArray: (bundlers) => {
			// Verify tsdown is included
			if (!bundlers.some((b) => b.name === "tsdown")) {
				// Return the original array if tsdown is not found
				return bundlers;
			}
			// Disabling the tsdown oxc usage as rxjs code base isn't compatible with isolated declarations
			const alteredBundlers = bundlers.map((bundler) => {
				if (bundler.name === "tsdown") {
					return {
						...bundler,
						name: "tsdown (tsc)",
						bundlerOptions: {
							...bundler.bundlerOptions,
							isolatedDeclarations: false,
						},
					};
				}
				return bundler;
			});
			return alteredBundlers;
		},
	},
];

// Define features declaratively
interface FeatureOptions {
	name: string;
	bundlerOptions?: BundlerOptions;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	alterBundlerArray?: (bundlers: any[]) => any[];
}
const features: FeatureOptions[] = [
	{
		name: "default",
		bundlerOptions: {},
	},
	{
		name: "cjs",
		bundlerOptions: {
			cjs: true,
		},
	},
	{
		name: "minify",
		bundlerOptions: {
			minify: true,
		},
	},
	{
		name: "sourcemap",
		bundlerOptions: {
			sourcemap: true,
		},
	},
	{
		name: "dts",
		bundlerOptions: {
			dts: true,
		},
		alterBundlerArray: (bundlers) => {
			// Verify tsdown is included
			if (!bundlers.some((b) => b.name === "tsdown")) {
				// Return the original array if tsdown is not found
				return bundlers;
			}
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

// Define bundlers declaratively
let bundlers = [
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

const benchmark = async () => {
	// Create the metrics object
	const benchmarkResults: BenchmarkResults = {};

	for (const project of projects) {
		// Initialize the map for the project
		benchmarkResults[project.name] = {};
		for (const feature of features) {
			// Initialize the map for the feature
			benchmarkResults[project.name][feature.name] = {};

			// Use the original bundler if no alteration is needed
			let bundlersToUse = bundlers;
			// Check if project.alterBundlerArray is defined and apply it
			if (project.alterBundlerArray) {
				bundlersToUse = project.alterBundlerArray(bundlersToUse);
			}
			// Check if feature.alterBundlerArray is defined and apply it
			if (feature.alterBundlerArray) {
				bundlersToUse = feature.alterBundlerArray(bundlersToUse);
			}

			// Add the build functions to the benchmark suite using the bundlers array
			for (const bundler of bundlersToUse) {
				bench(`${project.name}:${feature.name}@${bundler.name}`, async () => {
					await bundler.build({
						project: project.name,
						...project.bundlerOptions,
						...feature.bundlerOptions,
						...bundler.bundlerOptions,
					});
				});
			}
		}
	}

	// Run the benchmark
	const results = await run();

	// Convert the results to the custom metrics object
	results.benchmarks.forEach((benchmark) => {
		const name = benchmark.alias;
		const projectName = name.split(":")[0];
		const featureName = name.split(":")[1].split("@")[0];
		const bundlerName = name.split("@")[1];
		if (benchmark.runs.length > 0) {
			const run = benchmark.runs[0];
			const averageExecutionTime = run.stats?.avg ?? 0; // Execution time in nanoseconds
			const averageHeapUsage = run.stats?.heap?.avg ?? 0; // Heap usage in bytes
			benchmarkResults[projectName][featureName][bundlerName] = {
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

const main = async () => {
	// Parse CLI arguments for handling multiple runtimes
	const args = process.argv.slice(2);
	if (args.length > 0) {
		const runtime = args[1].toLowerCase();
		if (runtime === "bun") {
			// Only keep bunup entry in the bundlers array
			bundlers = bundlers.filter((b) => b.name === "bunup");
		}
	} else {
		// Remove the bunup entry in any other runtime
		bundlers = bundlers.filter((b) => b.name !== "bunup");
	}

	await benchmark();
};

main();
