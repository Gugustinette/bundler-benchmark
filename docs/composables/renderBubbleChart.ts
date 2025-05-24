import {
	BubbleController,
	Chart,
	Legend,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js";
import type { BenchmarkData } from "./useBenchmarkData";
import {
	COMMON_CHART_OPTIONS,
	createItemColorMapping,
} from "./utils/ChartUtil";
import { deepMerge } from "./utils/CommonUtil";

// Register the necessary chart components for bubble charts
Chart.register(LinearScale, BubbleController, PointElement, Tooltip, Legend);

interface BubbleChartOptions {
	canvas: HTMLCanvasElement;
	data: BenchmarkData;
}

export const renderBubbleChart = ({
	canvas,
	data,
}: BubbleChartOptions): void => {
	// Get all unique item names across all groups
	const allItems = new Set<string>();
	Object.values(data.executionTime).forEach((groupData) => {
		Object.keys(groupData).forEach((item) => allItems.add(item));
	});

	// Create consistent color mapping for items
	const itemColorMapping = createItemColorMapping(Array.from(allItems));

	// Restructure data: each item becomes a dataset containing data for all groups
	const datasets = Array.from(allItems).map((item) => {
		const itemData = Object.keys(data.executionTime)
			.map((group) => {
				const executionTime = data.executionTime[group][item] || 0;
				const heapUsage = data.heapUsage[group]?.[item]
					? data.heapUsage[group][item]
					: 0;

				// Only include data point if the item exists in this group
				if (data.executionTime[group][item] !== undefined) {
					return {
						x: executionTime,
						y: heapUsage,
						r: 8,
						groupLabel: group, // Store the group label for tooltips
					};
				}
				return null;
			})
			.filter(Boolean); // Remove null entries

		return {
			label: item, // Now the dataset label is the item name
			data: itemData,
			backgroundColor: itemColorMapping[item].background,
			borderColor: itemColorMapping[item].border,
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
							const itemLabel = context.dataset.label || "";
							const groupLabel =
								(context.raw as { groupLabel?: string }).groupLabel || "N/A";
							const xValue = context.parsed.x;
							const yValue = context.parsed.y;
							return `${itemLabel} (${groupLabel}): Time=${Number(xValue).toFixed(0)}ms, Heap=${Number(yValue).toFixed(0)}MB`;
						},
					},
				},
			},
			scales: {
				x: {
					title: {
						text: "Execution Time (ms)",
						display: true,
						color: "#888",
					},
					type: "linear",
					position: "bottom",
				},
				y: {
					title: {
						text: "Heap Usage (MB)",
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
