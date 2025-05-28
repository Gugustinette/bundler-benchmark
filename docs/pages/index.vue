<template>
  <main class="dark-mode">
    <h1>TS Bundler Benchmark</h1>
    <p>
      This benchmark compares the performance of popular TypeScript bundlers
      when bundling a thousand
    <Tooltip>
      <template #trigger>
        <span style="border-bottom: 1px dashed #ee711e; cursor: pointer;">functions</span>
      </template>
      <template #content>
        <p>This is the typical function used in the benchmark:</p>
        <NuxtImg src="/ts-function.png" alt="Example TypeScript function" width="600" />
      </template>
    </Tooltip> :
    </p>
    <ul>
      <li>
        <a href="https://github.com/unjs/unbuild" target="_blank">unbuild</a>
      </li>
      <li><a href="https://tsup.egoist.dev/" target="_blank">tsup</a></li>
      <li>
        <a href="https://tsdown.dev/" target="_blank">tsdown</a> (both with oxc
        and tsc)
      </li>
      <li><a href="https://lib.rsbuild.dev/" target="_blank">rslib</a></li>
    </ul>
    <p>
      Benchmark was run on a MacBook M1 Pro with 16GB of RAM, using Node.js
      v22.2.0.
      <br />
      Source code for the benchmark is available on
      <a
        href="https://github.com/gugustinette/bundler-benchmark"
        target="_blank"
        >GitHub</a
      >.
    </p>

    <p>
      You can visualize the results by selecting a specific feature from the
      dropdown below. The charts will update to show execution time and heap
      usage.
    </p>
    <Select
      :options="featureList"
      v-model="selectedFeature"
      placeholder="Select a feature to visualize"
      aria-label="Feature selection"
    />

    <!-- Execution time by heap usage bubble chart -->
    <h2>Execution time by heap usage</h2>
    <div class="chart-container">
      <canvas ref="executionTimeByHeapUsageCanva"></canvas>
    </div>

    <!-- Execution time -->
    <h2>Execution time (less is better)</h2>
    <div class="chart-container">
      <canvas ref="executionTimeCanva"></canvas>
    </div>

    <!-- Heap usage -->
    <h2>Heap usage (less is better)</h2>
    <div class="chart-container">
      <canvas ref="heapUsageCanva"></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Chart } from "chart.js";
import { onMounted, ref } from "vue";
import {
	type BenchmarkResults,
	useBenchmarkResults,
} from "~/composables/useBenchmarkData";

const benchmarkResults = ref<BenchmarkResults | null>(null);

interface Option {
	// biome-ignore lint/suspicious/noExplicitAny: Using any for flexibility in value types
	value: any;
	label: string;
	disabled?: boolean;
}
const featureList: Option[] = [
	{ value: "default", label: "Default" },
	{ value: "cjs", label: "CommonJS" },
	{ value: "minify", label: "Minification" },
	{ value: "sourcemap", label: "Source Maps" },
	{ value: "dts", label: "DTS" },
];
const selectedFeature = ref(featureList[0].value);

// Executioe time by heap usage bubble chart
const executionTimeByHeapUsageCanva = ref<HTMLCanvasElement | null>(null);
let executionTimeByHeapUsageChart: Chart | null = null;
// Execution time bar chart
const executionTimeCanva = ref<HTMLCanvasElement | null>(null);
let executionTimeChart: Chart | null = null;
// Heap usage bar chart
const heapUsageCanva = ref<HTMLCanvasElement | null>(null);
let heapUsageChart: Chart | null = null;

onMounted(async () => {
	// Get benchmark results
	benchmarkResults.value = await useBenchmarkResults();

	// Render charts
	if (executionTimeByHeapUsageCanva.value) {
		executionTimeByHeapUsageChart = renderBubbleChart({
			canvas: executionTimeByHeapUsageCanva.value,
			data: benchmarkResults.value,
			feature: "default",
		});
	}

	if (executionTimeCanva.value) {
		executionTimeChart = renderBarChart({
			canvas: executionTimeCanva.value,
			data: benchmarkResults.value,
			feature: "default",
			measurement: "executionTime",
		});
	}
	if (heapUsageCanva.value) {
		heapUsageChart = renderBarChart({
			canvas: heapUsageCanva.value,
			data: benchmarkResults.value,
			feature: "default",
			measurement: "heapUsage",
		});
	}
});

watch(
	selectedFeature,
	(newFeature) => {
		if (!benchmarkResults.value) return;

		// Update charts
		if (executionTimeByHeapUsageChart) {
			updateBubbleChart({
				chart: executionTimeByHeapUsageChart,
				data: benchmarkResults.value,
				feature: newFeature,
			});
		}
		if (executionTimeChart) {
			updateBarChart({
				chart: executionTimeChart,
				data: benchmarkResults.value,
				feature: newFeature,
				measurement: "executionTime",
			});
		}
		if (heapUsageChart) {
			updateBarChart({
				chart: heapUsageChart,
				data: benchmarkResults.value,
				feature: newFeature,
				measurement: "heapUsage",
			});
		}
	},
	{ immediate: true },
);
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 1rem;
  max-width: 800px;
  margin: 0 2rem;
}
.chart-container {
  position: relative;
  height: 40vh;
  width: 90%;
  max-width: 800px;
}
</style>
