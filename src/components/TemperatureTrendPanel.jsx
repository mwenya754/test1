import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDate } from '../weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TemperatureTrendPanel({ forecast }) {
  const chartData = {
    labels: forecast.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecast.map((d) => d.temp),
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.18)',
        pointBackgroundColor: '#fb923c',
        pointBorderColor: '#fb923c',
        pointRadius: 3.5,
        pointHoverRadius: 4.5,
        borderWidth: 2.5,
        tension: 0.38,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#102131',
        borderColor: 'rgba(173, 216, 230, 0.26)',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#bbd1df',
          maxRotation: 0,
          font: { size: 12, weight: '600' },
        },
        grid: { color: 'rgba(145, 180, 196, 0.25)' },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#bbd1df',
          font: { size: 13, weight: '600' },
          padding: { bottom: 8 },
        },
        ticks: {
          color: '#bbd1df',
          callback: (v) => `${v}°C`,
        },
        grid: { color: 'rgba(145, 180, 196, 0.22)' },
      },
    },
  };

  return (
    <section className="panel chart-panel" aria-label="Temperature trend chart">
      <div className="panel-title-row">
        <h3>Temperature Trend</h3>
        <p>Next 7 days</p>
      </div>
      <div className="panel-divider" />
      <div className="chart-wrap">
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}