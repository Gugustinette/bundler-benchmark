import type { Chart } from "chart.js";
import type { BenchmarkResults } from "./useBenchmarkData";
import { createItemColorMapping } from "./utils/ChartUtil";

interface BarChartOptions {
	chart: Chart;
	data: BenchmarkResults;
	feature: string;
	measurement: "executionTime" | "heapUsage";
}

export const updateBarChart = ({
	chart,
	data,
	feature,
	measurement,
}: BarChartOptions): void => {
	// Get the feature data
	const featureData = data[feature];
	if (!featureData) {
		console.error(`Feature "${feature}" not found in benchmark data`);
		// Optionally clear the chart or display an error message within the chart
		chart.data.datasets = [];
		chart.update();
		return;
	}

	// Get all bundlers for this feature
	const bundlers = Object.keys(featureData);

	// Infer measurement details from the measurement type
	const measurementConfig = {
		executionTime: {
			yAxisTitle: "Execution Time (ms)",
			unit: "ms",
		},
		heapUsage: {
			yAxisTitle: "Heap Usage (MB)",
			unit: "MB",
		},
	};

	const config = measurementConfig[measurement];

	// Create consistent color mapping for bundlers (important to maintain consistency on updates)
	const bundlerColorMapping = createItemColorMapping(bundlers);

	// Create new datasets
	const datasets = bundlers.map((bundler) => ({
		label: bundler,
		data: [featureData[bundler][measurement]], // Single value array for this bundler
		backgroundColor: bundlerColorMapping[bundler].background,
		borderColor: bundlerColorMapping[bundler].border,
		borderWidth: 1,
	}));

	// Update the chart's data and labels
	chart.data.labels = [""]; // Keep a single empty label
	chart.data.datasets = datasets;

	// Update the chart options for the Y-axis title and tooltip
	if (chart.options.scales?.y) {
		// biome-ignore lint/suspicious/noExplicitAny: No type information available
		const yScale = chart.options.scales.y as any;
		if (yScale.title) {
			yScale.title.text = config.yAxisTitle;
		}
	}

	if (chart.options.plugins?.tooltip?.callbacks) {
		// biome-ignore lint/suspicious/noExplicitAny: No type information available
		chart.options.plugins.tooltip.callbacks.label = (context: any) => {
			const bundlerLabel = context.dataset.label || "";
			const yValue = context.parsed.y;
			return `${bundlerLabel}: ${Number(yValue).toFixed(0)}${config.unit}`;
		};
		// biome-ignore lint/suspicious/noExplicitAny: No type information available
		chart.options.plugins.tooltip.callbacks.title = (context: any) => {
			return `Feature: ${feature}`;
		};
	}

	// Redraw the chart
	chart.update();
};
