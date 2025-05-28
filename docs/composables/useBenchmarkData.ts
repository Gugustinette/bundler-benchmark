export interface BenchmarkResults {
	[feature: string]: {
		[bundler: string]: {
			executionTime: number; // in milliseconds
			heapUsage: number; // in megabytes
		};
	};
}

export const useBenchmarkResults = async (): Promise<BenchmarkResults> => {
	// Get the benchmark results from the JSON file
	const response = await fetch(
		"/bundler-benchmark/results/benchmark-results.json",
	);
	if (!response.ok) {
		throw new Error("Failed to fetch benchmark results");
	}
	const benchmarkResults = await response.json();

	// Return the benchmark results
	return benchmarkResults;
};
