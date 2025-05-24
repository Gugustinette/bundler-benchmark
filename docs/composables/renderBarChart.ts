import { BarController, BarElement, CategoryScale, Chart, LinearScale, plugins } from 'chart.js';
import { COMMON_CHART_OPTIONS, createItemColorMapping } from './utils/ChartUtil';
import { deepMerge } from './utils/CommonUtil';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

interface BarChartOptions {
  canvas: HTMLCanvasElement;
  data: BarChartData;
  yAxisTitle: string;
  measurementUnit?: string;
}

export const renderBarChart = (
  { canvas, data, yAxisTitle, measurementUnit }: BarChartOptions
): void => {
  const items = data ? Object.keys(data) : [];
  
  // Create consistent color mapping for items
  const itemColorMapping = createItemColorMapping(items);
  
  // Create one dataset per item so each can be toggled individually
  const datasets = items.map((item) => ({
    label: item,
    data: [data[item] || 0], // Single value array for this item
    backgroundColor: itemColorMapping[item].background,
    borderColor: itemColorMapping[item].border,
    borderWidth: 1
  }));

  const chartData = {
    labels: [''], // Single empty label since we're using multiple datasets
    datasets: datasets
  };

  new Chart(
    canvas,
    {
      type: 'bar',
      data: chartData,
      options: deepMerge({}, COMMON_CHART_OPTIONS, {
        scales: {
          y: {
            title: {
              text: yAxisTitle,
              display: true,
            },
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const itemLabel = context.dataset.label || '';
                const yValue = context.parsed.y;
                return `${itemLabel}: ${Number(yValue).toFixed(0)}${measurementUnit || ''}`;
              }
            }
          }
        },
      }),
    }
  );
}
