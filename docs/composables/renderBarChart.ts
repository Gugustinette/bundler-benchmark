import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

export const renderBarChart = (canvas: HTMLCanvasElement, data: BarChartData): void => {
  const labels = data ? Object.keys(data) : [];
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: labels.map(label => data[label] || 0), // Ensure data is an array of numbers
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };

  const chart = new Chart(
    canvas,
    {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              // Change grid color for Y axis
              color: 'rgba(200, 200, 200, 0.1)'
            },
            ticks: {
              // Change font color for Y axis labels
              color: '#888'
            }
          },
          x: {
            grid: {
              // Change grid color for X axis
              color: 'rgba(200, 200, 200, 0.1)'
            },
            ticks: {
              // Change font color for X axis labels
              color: '#888'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              // Change font color for legend
              color: '#888'
            }
          }
        },
      },
    }
  );
}
