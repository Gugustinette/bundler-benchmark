import {
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	Legend,
	LinearScale,
	Tooltip,
} from "chart.js";
import type { BenchmarkResults } from "./useBenchmarkData";
import {
	COMMON_CHART_OPTIONS,
	createItemColorMapping,
} from "./utils/ChartUtil";
import { deepMerge } from "./utils/CommonUtil";

Chart.register(
	CategoryScale,
	LinearScale,
	BarController,
	BarElement,
	Tooltip,
	Legend,
);

interface BarChartOptions {
	canvas: HTMLCanvasElement;
	data: BenchmarkResults;
	feature: string;
	measurement: "executionTime" | "heapUsage";
}

export const renderBarChart = ({
	canvas,
	data,
	feature,
	measurement,
}: BarChartOptions): Chart => {
	// Get the feature data
	const featureData = data[feature];
	if (!featureData) {
		throw new Error(`Feature "${feature}" not found in benchmark data`);
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

	// Create consistent color mapping for bundlers
	const bundlerColorMapping = createItemColorMapping(bundlers);

	// Create one dataset per bundler so each can be toggled individually
	const datasets = bundlers.map((bundler) => ({
		label: bundler,
		data: [featureData[bundler][measurement]], // Single value array for this bundler
		backgroundColor: bundlerColorMapping[bundler].background,
		borderColor: bundlerColorMapping[bundler].border,
		borderWidth: 1,
	}));

	const chartData = {
		labels: [""], // Single empty label since we're using multiple datasets
		datasets: datasets,
	};

	return new Chart(canvas, {
		type: "bar",
		data: chartData,
		options: deepMerge({}, COMMON_CHART_OPTIONS, {
			scales: {
				y: {
					title: {
						text: config.yAxisTitle,
						display: true,
						color: "#888",
					},
					beginAtZero: true,
				},
			},
			plugins: {
				tooltip: {
					callbacks: {
						// biome-ignore lint/suspicious/noExplicitAny: No type information available
						label: (context: any) => {
							const bundlerLabel = context.dataset.label || "";
							const yValue = context.parsed.y;
							return `${bundlerLabel}: ${Number(yValue).toFixed(0)}${config.unit}`;
						},
						// biome-ignore lint/suspicious/noExplicitAny: No type information available
						title: (context: any) => {
							return `Feature: ${feature}`;
						},
					},
				},
			},
		}),
	});
};
