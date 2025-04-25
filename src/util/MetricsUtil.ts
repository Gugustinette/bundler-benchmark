export interface BarChartMetrics {
  [projectName: string]: { [bundlerName: string]: number }
}

/**
 * Utility class for generating metrics visualizations
 */
export class MetricsUtil {
  /**
   * Configuration options for the bar chart
   */
  private static readonly DEFAULT_OPTIONS = {
    width: 800,
    height: 500,
    margin: { top: 60, right: 120, bottom: 60, left: 80 },
    barPadding: 0.2,
    barGroupPadding: 0.4,
    colors: [
      "#4285F4",
      "#34A853",
      "#FBBC05",
      "#EA4335",
      "#8AB4F8",
      "#CEEAD6",
      "#FDE293",
      "#F28B82",
    ],
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    title: "Bundle Execution Times (ms)",
    yAxisLabel: "Execution Time (ms)",
    legendTitle: "Bundlers:",
    showValues: true,
    formatValue: (value: number) => value.toString(),
    decimalPlaces: 0,
  };

  /**
   * Generates an SVG bar chart from bundler metrics
   * @param metrics Object containing project metrics data
   * @param options Optional configuration for the chart
   * @returns SVG string representation of the bar chart
   */
  public static generateBarChart(
    metrics: BarChartMetrics,
    options: Partial<typeof MetricsUtil.DEFAULT_OPTIONS> = {}
  ): string {
    // Validate input
    if (!metrics || typeof metrics !== "object" || Object.keys(metrics).length === 0) {
      throw new Error(
        "Invalid metrics data: object with at least one project is required"
      );
    }

    // Merge default options with provided options
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    // Extract all project names and bundler names
    const projectNames = Object.keys(metrics);
    const bundlerNames = new Set<string>();

    // Get all unique bundler names and find the maximum value
    let maxValue = 0;
    for (const project of projectNames) {
      if (typeof metrics[project] !== "object") {
        throw new Error(
          `Invalid metrics data for project "${project}": object expected`
        );
      }

      for (const bundler of Object.keys(metrics[project])) {
        const value = metrics[project][bundler];
        if (typeof value !== "number" || isNaN(value)) {
          throw new Error(
            `Invalid execution time for bundler "${bundler}" in project "${project}": number expected`
          );
        }

        bundlerNames.add(bundler);
        maxValue = Math.max(maxValue, value);
      }
    }

    // Round max value up to a nice number for the y-axis
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    maxValue = Math.ceil(maxValue / magnitude) * magnitude;

    const bundlersArray = Array.from(bundlerNames);

    // Calculate chart dimensions
    const { width, height, margin } = config;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate bar width and spacing
    const totalGroups = projectNames.length;
    const bundlersPerGroup = bundlersArray.length;
    const groupWidth = chartWidth / totalGroups;
    const barWidth =
      (groupWidth * (1 - config.barGroupPadding)) / bundlersPerGroup;

    // Create the SVG content
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;

    // Add a white background rectangle
    svg += `  <rect width="${width}" height="${height}" fill="white" />\n`;

    // Add a title
    svg += `  <text x="${width / 2}" y="${
      margin.top / 2
    }" font-family="${config.fontFamily}" font-size="${
      config.fontSize + 6
    }" font-weight="bold" text-anchor="middle">${config.title}</text>\n`;

    // Create a group for the chart content with a transform to account for margins
    svg += `  <g transform="translate(${margin.left}, ${margin.top})">\n`;

    // Draw the y-axis and grid lines
    const yAxisSteps = 10;
    for (let i = 0; i <= yAxisSteps; i++) {
      const y = chartHeight - (i / yAxisSteps) * chartHeight;
      const value = (i / yAxisSteps) * maxValue;
      const formattedValue = value.toFixed(config.decimalPlaces);

      // Grid line
      svg += `    <line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="#ddd" stroke-width="1" />\n`;

      // Y-axis label
      svg += `    <text x="-10" y="${y}" font-family="${
        config.fontFamily
      }" font-size="${
        config.fontSize
      }" text-anchor="end" dominant-baseline="middle">${formattedValue}</text>\n`;
    }

    // Y-axis title
    svg += `    <text x="-${margin.left / 2}" y="${
      chartHeight / 2
    }" font-family="${config.fontFamily}" font-size="${
      config.fontSize
    }" text-anchor="middle" transform="rotate(-90, -${margin.left / 2}, ${
      chartHeight / 2
    })">${config.yAxisLabel}</text>\n`;

    // X-axis line
    svg += `    <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#000" stroke-width="1" />\n`;

    // Draw the bars
    projectNames.forEach((project, projectIndex) => {
      const groupX = projectIndex * groupWidth;

      // Add project name below the x-axis
      svg += `    <text x="${groupX + groupWidth / 2}" y="${
        chartHeight + 30
      }" font-family="${config.fontFamily}" font-size="${
        config.fontSize
      }" text-anchor="middle">${project}</text>\n`;

      bundlersArray.forEach((bundler, bundlerIndex) => {
        const value = metrics[project][bundler] || 0;
        const barHeight = (value / maxValue) * chartHeight;
        const barX =
          groupX +
          (config.barGroupPadding * groupWidth) / 2 +
          bundlerIndex * barWidth;
        const barY = chartHeight - barHeight;
        const colorIndex = bundlerIndex % config.colors.length;

        // Draw the bar
        svg += `    <rect x="${barX}" y="${barY}" width="${
          barWidth * (1 - config.barPadding)
        }" height="${barHeight}" fill="${
          config.colors[colorIndex]
        }" />\n`;

        // Add the value on top of the bar if showValues is true
        if (config.showValues && barHeight > config.fontSize * 2) {
          const formattedValue = config.formatValue(value);
          svg += `    <text x="${barX + (barWidth / 2) * (1 - config.barPadding)}" y="${
            barY + barHeight / 2
          }" font-family="${config.fontFamily}" font-size="${
            config.fontSize
          }" text-anchor="middle" fill="#fff" dominant-baseline="middle">${formattedValue}</text>\n`;
        } else if (config.showValues) {
          const formattedValue = config.formatValue(value);
          svg += `    <text x="${barX + (barWidth / 2) * (1 - config.barPadding)}" y="${
            barY - 5
          }" font-family="${config.fontFamily}" font-size="${
            config.fontSize
          }" text-anchor="middle">${formattedValue}</text>\n`;
        }
      });
    });

    // Add a legend
    const legendX = chartWidth + 10;
    let legendY = 0;

    // Legend title
    svg += `    <text x="${legendX}" y="${legendY}" font-family="${
      config.fontFamily
    }" font-size="${
      config.fontSize
    }" font-weight="bold" text-anchor="start">${
      config.legendTitle
    }</text>\n`;
    legendY += 25;

    bundlersArray.forEach((bundler, index) => {
      const y = legendY + index * 25;
      const colorIndex = index % config.colors.length;

      // Legend color box
      svg += `    <rect x="${legendX}" y="${y}" width="15" height="15" fill="${
        config.colors[colorIndex]
      }" />\n`;

      // Legend text
      svg += `    <text x="${legendX + 25}" y="${
        y + 12
      }" font-family="${config.fontFamily}" font-size="${
        config.fontSize
      }" text-anchor="start">${bundler}</text>\n`;
    });

    // Close the chart group
    svg += `  </g>\n`;

    // Close the SVG tag
    svg += `</svg>`;

    return svg;
  }

  /**
   * Saves the SVG chart to a file (Node.js environment only)
   * @param svg SVG content to save
   * @param filePath Path to save the file
   */
  public static saveSvgToFile(svg: string, filePath: string): void {
    try {
      // Check if we're in a Node.js environment
      if (typeof require !== "undefined") {
        const fs = require("fs");
        fs.writeFileSync(filePath, svg, "utf8");
      } else {
        throw new Error("This method can only be used in a Node.js environment");
      }
    } catch (error) {
      console.error("Error saving SVG to file:", error);
      throw error;
    }
  }
}
