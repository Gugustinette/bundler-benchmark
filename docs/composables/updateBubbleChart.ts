import type { Chart } from "chart.js";
import type { BenchmarkResults } from "./useBenchmarkData";
import { createItemColorMapping } from "./utils/ChartUtil";

interface BubbleChartOptions {
	chart: Chart;
	data: BenchmarkResults;
	feature: string;
}

export const updateBubbleChart = ({
	chart,
	data,
	feature,
}: BubbleChartOptions): void => {
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

	// Create consistent color mapping for bundlers (important to maintain consistency on updates)
	const bundlerColorMapping = createItemColorMapping(bundlers);

	// Create new datasets
	const datasets = bundlers.map((bundler) => {
		const result = featureData[bundler];

		return {
			label: bundler, // Dataset label is the bundler name
			data: [
				{
					x: result.heapUsage,
					y: result.executionTime,
					r: 8,
					bundlerLabel: bundler, // Store bundler name for tooltips
				},
			],
			backgroundColor: bundlerColorMapping[bundler].background,
			borderColor: bundlerColorMapping[bundler].border,
			borderWidth: 1,
		};
	});

	// Update the chart's data
	chart.data.datasets = datasets;

	// Update the chart options if necessary (e.g., the tooltip title which includes the feature)
	if (chart.options.plugins?.tooltip?.callbacks) {
		// biome-ignore lint/suspicious/noExplicitAny: No type information available
		chart.options.plugins.tooltip.callbacks.title = (context: any) => {
			return `Feature: ${feature}`;
		};
	}

	// Redraw the chart
	chart.update();
};
