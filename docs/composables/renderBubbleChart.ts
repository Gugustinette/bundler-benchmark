import {
	BubbleController,
	Chart,
	Legend,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js";
import type { BenchmarkResults } from "./useBenchmarkData";
import {
	COMMON_CHART_OPTIONS,
	createItemColorMapping,
} from "./utils/ChartUtil";
import { deepMerge } from "./utils/CommonUtil";

// Register the necessary chart components for bubble charts
Chart.register(LinearScale, BubbleController, PointElement, Tooltip, Legend);

interface BubbleChartOptions {
	canvas: HTMLCanvasElement;
	data: BenchmarkResults;
	feature: string;
}

export const renderBubbleChart = ({
	canvas,
	data,
	feature,
}: BubbleChartOptions): void => {
	// Get the feature data
	const featureData = data[feature];
	if (!featureData) {
		throw new Error(`Feature "${feature}" not found in benchmark data`);
	}

	// Get all bundlers for this feature
	const bundlers = Object.keys(featureData);

	// Create consistent color mapping for bundlers
	const bundlerColorMapping = createItemColorMapping(bundlers);

	// Create datasets: each bundler becomes a dataset with a single data point
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

	new Chart(canvas, {
		type: "bubble",
		data: {
			datasets: datasets,
		},
		options: deepMerge({}, COMMON_CHART_OPTIONS, {
			plugins: {
				legend: {
					display: true, // Enable the legend
					position: "top",
					labels: {
						color: "#888",
						usePointStyle: true, // Use circle points in legend
						pointStyle: "circle",
					},
				},
				tooltip: {
					callbacks: {
						// biome-ignore lint/suspicious/noExplicitAny: No type information available
						label: (context: any) => {
							const bundlerLabel = context.dataset.label || "";
							const xValue = context.parsed.x;
							const yValue = context.parsed.y;
							return `${bundlerLabel}: Time=${Number(yValue).toFixed(0)}ms, Heap=${Number(xValue).toFixed(0)}MB`;
						},
						// biome-ignore lint/suspicious/noExplicitAny: No type information available
						title: (context: any) => {
							return `Feature: ${feature}`;
						},
					},
				},
			},
			scales: {
				x: {
					title: {
						text: "Heap Usage (MB)",
						display: true,
						color: "#888",
					},
					type: "linear",
					position: "bottom",
				},
				y: {
					title: {
						text: "Execution Time (ms)",
						display: true,
						color: "#888",
					},
					type: "linear",
					beginAtZero: true,
				},
			},
		}),
	});
};
