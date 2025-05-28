export const COMMON_DATASET_OPTIONS = {
	backgroundColor: [
		"rgba(255, 99, 132, 0.2)",
		"rgba(255, 159, 64, 0.2)",
		"rgba(255, 205, 86, 0.2)",
		"rgba(75, 192, 192, 0.2)",
		"rgba(54, 162, 235, 0.2)",
		"rgba(153, 102, 255, 0.2)",
		"rgba(201, 203, 207, 0.2)",
	],
	borderColor: [
		"rgb(255, 99, 132)",
		"rgb(255, 159, 64)",
		"rgb(255, 205, 86)",
		"rgb(75, 192, 192)",
		"rgb(54, 162, 235)",
		"rgb(153, 102, 255)",
		"rgb(201, 203, 207)",
	],
	borderWidth: 1,
};

// Function to create consistent color mapping for items within the bubble chart
export const createItemColorMapping = (items: string[]) => {
	const colorMapping: Record<string, { background: string; border: string }> =
		{};

	items.forEach((item, index) => {
		const colorIndex = index % COMMON_DATASET_OPTIONS.backgroundColor.length;
		colorMapping[item] = {
			background: COMMON_DATASET_OPTIONS.backgroundColor[colorIndex],
			border: COMMON_DATASET_OPTIONS.borderColor[colorIndex],
		};
	});

	return colorMapping;
};

export const COMMON_CHART_OPTIONS = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: true,
			labels: {
				color: "#888",
				usePointStyle: true,
				pointStyle: "rect",
			},
		},
		tooltip: {
			backgroundColor: "rgba(0, 0, 0, 0.8)",
			titleColor: "#fff",
			bodyColor: "#fff",
		},
	},
	scales: {
		x: {
			grid: {
				color: "rgba(200, 200, 200, 0.1)",
			},
			ticks: {
				color: "#888",
			},
			title: {
				display: true,
				color: "#888",
			},
		},
		y: {
			grid: {
				color: "rgba(200, 200, 200, 0.1)",
			},
			ticks: {
				color: "#888",
			},
			title: {
				display: true,
				text: "Y Axis Title",
				color: "#888",
			},
		},
	},
};
