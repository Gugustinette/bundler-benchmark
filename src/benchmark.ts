import { build as buildUnbuild } from './bundlers/unbuild';
import { build as buildTsup } from './bundlers/tsup';
import { build as buildTsdown } from './bundlers/tsdown';
import { TimeUtil } from './util/TimeUtil';
import { BarChartMetrics, MetricsUtil } from './util/MetricsUtil';

const projects = [
  {
    name: 'thousand-functions',
    bundlerOptions: {}
  },
  {
    name: 'thousand-typed-functions',
    bundlerOptions: {
      dts: true,
    },
  },
];

const benchmark = async () => {
  const bundlerMetrics: BarChartMetrics = {};

  for (const project of projects) {
    bundlerMetrics[project.name] = {};

    // unbuild
    const unbuildExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildUnbuild({
        project: project.name,
        ...project.bundlerOptions,
      })
    );
    bundlerMetrics[project.name]['unbuild'] = unbuildExecutionTime;

    // tsup
    const tsupExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildTsup({
        project: project.name,
        ...project.bundlerOptions,
      })
    );
    bundlerMetrics[project.name]['tsup'] = tsupExecutionTime;

    // tsdown
    const tsdownExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
      buildTsdown({
        project: project.name,
        ...project.bundlerOptions,
      })
    );
    bundlerMetrics[project.name]['tsdown'] = tsdownExecutionTime;
  }

  // Log the metrics to the console
  MetricsUtil.logMetrics(bundlerMetrics);

  // Generate the SVG chart
  const svgChart = MetricsUtil.generateBarChart(bundlerMetrics, {
    title: "Bundler Performance Comparison",
    width: 900,
    height: 600,
    formatValue: (value) => `${value.toFixed(0)} ms`,
  });

  // Save the SVG chart to a file
  MetricsUtil.saveSvgToFile(svgChart, 'results/bundler-performance-comparison.svg');
  console.log('SVG chart saved to results/bundler-performance-comparison.svg');
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
