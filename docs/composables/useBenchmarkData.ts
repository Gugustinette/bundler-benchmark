export interface BarChartData {
  [item: string]: number;
}
export interface BarChartMetrics {
  [group: string]: BarChartData;
}
export interface BenchmarkData {
  executionTime: BarChartMetrics;
  heapUsage: BarChartMetrics;
}

export const useBenchmarkData = async (): Promise<BenchmarkData> => {
  // Get Execution Time Benchmark Data
  let response = await fetch('/bundler-benchmark/results/bundler-execution-time-comparison.json');
  if (!response.ok) {
    throw new Error('Failed to fetch benchmark data');
  }
  const executionTimeData = await response.json();

  // Get Heap Usage Benchmark Data
  response = await fetch('/bundler-benchmark/results/bundler-heap-usage-comparison.json');
  if (!response.ok) {
    throw new Error('Failed to fetch benchmark data');
  }
  const heapUsageData = await response.json();

  // Return the benchmark data
  return {
    executionTime: executionTimeData,
    heapUsage: heapUsageData
  };
}
