import { BarChartMetrics } from "svgraph";

/**
 * Utility class for handling metrics
 */
export class MetricsUtil {
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

  /**
   * Log the results of the benchmark
   * @param metrics Object containing project metrics data
   */
  public static logMetrics(name: string, unit: string, metrics: BarChartMetrics): void {
    console.log(`\n${name}:`);
    for (const project in metrics) {
      console.log(`  Project: ${project}`);
      for (const bundler in metrics[project]) {
        console.log(
          `    ${bundler}: ${metrics[project][bundler]} ${unit}`
        );
      }
    }
    console.log("");
  }
}
