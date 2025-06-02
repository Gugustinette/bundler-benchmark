import { CommonUtil } from "./CommonUtil";

export interface BenchmarkResults {
	[feature: string]: {
		[bundler: string]: {
			executionTime: number; // in milliseconds
			heapUsage: number; // in megabytes
		};
	};
}

/**
 * Utility class for handling metrics
 */
export class MetricsUtil {
	/**
	 * Save given metrics to a JSON file
	 * @param metrics Object containing benchmark results
	 * @param filePath Path to save the JSON file
	 */
	public static saveMetricsToJson(
		metrics: BenchmarkResults,
		filePath: string,
	): void {
		try {
			// Check if we're in a Node.js environment
			if (typeof require !== "undefined") {
				const fs = require("node:fs");
				let existingData: BenchmarkResults = {};
				if (fs.existsSync(filePath)) {
					const fileContent = fs.readFileSync(filePath, "utf8");
					existingData = JSON.parse(fileContent);
				}

				const mergedData = CommonUtil.deepMerge(existingData, metrics);

				fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), "utf8");
			} else {
				throw new Error(
					"This method can only be used in a Node.js environment",
				);
			}
		} catch (error) {
			console.error("Error saving metrics to JSON file:", error);
			throw error;
		}
	}

	/**
	 * Log the results of the benchmark
	 * @param metrics Object containing project metrics data
	 */
	public static logMetrics(metrics: BenchmarkResults): void {
		console.log("Benchmark Results:");
		for (const project in metrics) {
			console.log(`Project: ${project}`);
			for (const bundler in metrics[project]) {
				const { executionTime, heapUsage } = metrics[project][bundler];
				console.log(
					`  Bundler: ${bundler}, Execution Time: ${executionTime.toFixed(
						2,
					)} ms, Heap Usage: ${(heapUsage).toFixed(2)} MB`,
				);
			}
		}
		console.log("");
	}
}
