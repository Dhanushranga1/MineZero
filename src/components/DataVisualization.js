import { useEffect } from 'react';
import { Chart } from 'chart.js';

export default function DataVisualization({ data }) {
  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Excavation', 'Transportation', 'Equipment'],
        datasets: [
          {
            label: 'Carbon Emissions',
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas id="myChart" />;
}
