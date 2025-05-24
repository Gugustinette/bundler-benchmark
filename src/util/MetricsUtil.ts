export interface BarChartMetrics {
  [group: string]: {
    [item: string]: number;
  };
}

/**
 * Utility class for handling metrics
 */
export class MetricsUtil {
  /**
   * Save given metrics to a JSON file
   * @param metrics Object containing project metrics data
   * @param filePath Path to save the JSON file
   */
  public static saveMetricsToJson(metrics: BarChartMetrics, filePath: string): void {
    try {
      // Check if we're in a Node.js environment
      if (typeof require !== "undefined") {
        const fs = require("fs");
        fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2), "utf8");
      } else {
        throw new Error("This method can only be used in a Node.js environment");
      }
    } catch (error) {
      console.error("Error saving metrics to JSON file:", error);
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
