<template>
  <main>
    <h1>TS Bundler Benchmark</h1>
    <p>
      This benchmark compares the performance of popular TypeScript bundlers when handling a large number of functions :
    </p>
    <ul>
      <li><a href="https://github.com/unjs/unbuild" target="_blank">unbuild</a></li>
      <li><a href="https://tsup.egoist.dev/" target="_blank">tsup</a></li>
      <li><a href="https://tsdown.dev/" target="_blank">tsdown</a> (both with oxc and tsc)</li>
      <li><a href="https://lib.rsbuild.dev/" target="_blank">rslib</a></li>
    </ul>
    <p>
      It includes two scenarios: one with regular functions and another with typed functions (generating dts).
      <br />
      Benchmark was run on a MacBook Pro M1 Pro with 16GB of RAM, using Node.js v22.2.0.
      <br />
      Source code for the benchmark is available on <a href="https://github.com/gugustinette/bundler-benchmark" target="_blank">GitHub</a>.
    </p>

    <!-- Execution time by heap usage bubble chart -->
    <h2>Execution time by heap usage</h2>
    <div class="chart-container">
      <canvas ref="chartExecutionTimeByHeapUsage"></canvas>
    </div>

    <!-- Execution time -->
    <h2>Execution time (less is better)</h2>
    <h3>Thousand function</h3>
    <div class="chart-container">
      <canvas ref="chartExecutionTime_ThousandFunctions"></canvas>
    </div>
    <h3>Thousand typed function</h3>
    <div class="chart-container">
      <canvas ref="chartExecutionTime_ThousandTypedFunctions"></canvas>
    </div>

    <!-- Heap usage -->
    <h2>Heap usage (less is better)</h2>
    <h3>Thousand function</h3>
    <div class="chart-container">
      <canvas ref="chartHeapUsage_ThousandFunctions"></canvas>
    </div>
    <h3>Thousand typed function</h3>
    <div class="chart-container">
      <canvas ref="chartHeapUsage_ThousandTypedFunctions"></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { renderBarChart } from '#imports';

const chartExecutionTimeByHeapUsage = ref<HTMLCanvasElement | null>(null);
const chartExecutionTime_ThousandFunctions = ref<HTMLCanvasElement | null>(null);
const chartExecutionTime_ThousandTypedFunctions = ref<HTMLCanvasElement | null>(null);
const chartHeapUsage_ThousandFunctions = ref<HTMLCanvasElement | null>(null);
const chartHeapUsage_ThousandTypedFunctions = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  // Get benchmark data
  const benchmarkData = await useBenchmarkData();

  // Render charts
  if (chartExecutionTimeByHeapUsage.value) {
    renderBubbleChart({
      canvas: chartExecutionTimeByHeapUsage.value,
      data: benchmarkData
    });
  }

  if (chartExecutionTime_ThousandFunctions.value) {
    renderBarChart({
      canvas: chartExecutionTime_ThousandFunctions.value,
      data: benchmarkData.executionTime["thousand-functions"],
      yAxisTitle: 'Execution Time (ms)',
      measurementUnit: 'ms',
    });
  }
  if (chartExecutionTime_ThousandTypedFunctions.value) {
    renderBarChart({
      canvas: chartExecutionTime_ThousandTypedFunctions.value,
      data: benchmarkData.executionTime["thousand-typed-functions"],
      yAxisTitle: 'Execution Time (ms)',
      measurementUnit: 'ms',
    });
  }
  if (chartHeapUsage_ThousandFunctions.value) {
    renderBarChart({
      canvas: chartHeapUsage_ThousandFunctions.value,
      data: benchmarkData.heapUsage["thousand-functions"],
      yAxisTitle: 'Heap Usage (MB)',
      measurementUnit: 'MB',
    });
  }
  if (chartHeapUsage_ThousandTypedFunctions.value) {
    renderBarChart({
      canvas: chartHeapUsage_ThousandTypedFunctions.value,
      data: benchmarkData.heapUsage["thousand-typed-functions"],
      yAxisTitle: 'Heap Usage (MB)',
      measurementUnit: 'MB',
    });
  }
});
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
