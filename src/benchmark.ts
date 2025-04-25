import { build as buildUnbuild } from './bundlers/unbuild';
import { build as buildTsup } from './bundlers/tsup';
import { build as buildTsdown } from './bundlers/tsdown';
import { TimeUtil } from './util/TimeUtil';
import { BarChartMetrics, MetricsUtil } from './util/MetricsUtil';

const projects = [
  'thousand-functions',
];

const benchmark = async () => {
  const bundlerMetrics: BarChartMetrics = {};

  for (const project of projects) {
    bundlerMetrics[project] = {};

    // unbuild
    const unbuildExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildUnbuild({
        project: 'thousand-functions',
      })
    );
    bundlerMetrics[project]['unbuild'] = unbuildExecutionTime;

    // tsup
    const tsupExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildTsup({
        project: 'thousand-functions',
      })
    );
    bundlerMetrics[project]['tsup'] = tsupExecutionTime;

    // tsdown
    const tsdownExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildTsdown({
        project: 'thousand-functions',
      })
    );
    bundlerMetrics[project]['tsdown'] = tsdownExecutionTime;
  }

  // Generate the SVG chart
  const svgChart = MetricsUtil.generateBarChart(bundlerMetrics, {
    title: "Bundler Performance Comparison",
    width: 900,
    height: 600,
    formatValue: (value) => `${value}ms`,
  });

  // Save the SVG chart to a file
  MetricsUtil.saveSvgToFile(svgChart, 'results/bundler-performance-comparison.svg');
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
