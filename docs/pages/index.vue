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

    <!-- Execution Time -->
    <h2>Execution Time (less is better)</h2>
    <h3>Thousand Function</h3>
    <div class="chart-container">
      <canvas ref="chartExecutionTime_ThousandFunctions"></canvas>
    </div>
    <h3>Thousand Typed Function</h3>
    <div class="chart-container">
      <canvas ref="chartExecutionTime_ThousandTypedFunctions"></canvas>
    </div>

    <!-- Heap Usage -->
    <h2>Heap Usage (less is better)</h2>
    <h3>Thousand Function</h3>
    <div class="chart-container">
      <canvas ref="chartHeapUsage_ThousandFunctions"></canvas>
    </div>
    <h3>Thousand Typed Function</h3>
    <div class="chart-container">
      <canvas ref="chartHeapUsage_ThousandTypedFunctions"></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { renderBarChart } from '#imports';

const chartExecutionTime_ThousandFunctions = ref<HTMLCanvasElement | null>(null);
const chartExecutionTime_ThousandTypedFunctions = ref<HTMLCanvasElement | null>(null);
const chartHeapUsage_ThousandFunctions = ref<HTMLCanvasElement | null>(null);
const chartHeapUsage_ThousandTypedFunctions = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  // Get benchmark data
  const benchmarkData = await useBenchmarkData();

  // Render charts
  if (chartExecutionTime_ThousandFunctions.value) {
    renderBarChart(chartExecutionTime_ThousandFunctions.value, benchmarkData.executionTime["thousand-functions"]);
  }
  if (chartExecutionTime_ThousandTypedFunctions.value) {
    renderBarChart(chartExecutionTime_ThousandTypedFunctions.value, benchmarkData.executionTime["thousand-typed-functions"]);
  }
  if (chartHeapUsage_ThousandFunctions.value) {
    renderBarChart(chartHeapUsage_ThousandFunctions.value, benchmarkData.heapUsage["thousand-functions"]);
  }
  if (chartHeapUsage_ThousandTypedFunctions.value) {
    renderBarChart(chartHeapUsage_ThousandTypedFunctions.value, benchmarkData.heapUsage["thousand-typed-functions"]);
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
