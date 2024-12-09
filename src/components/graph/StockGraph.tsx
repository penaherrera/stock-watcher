import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockGraphProps {
  stockData: { symbol: string; price: number; timeStamp: number }[];
}

const StockGraph: React.FC<StockGraphProps> = ({ stockData }) => {
  const prices = stockData.map((data) => data.price);

  const timeStamps = stockData.map((data) => {
    const date = new Date(data.timeStamp * 1000);
    return date.toLocaleTimeString();
  });

  const data = {
    labels: timeStamps,
    datasets: [
      {
        label: "Price",
        data: prices,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          color: "white",
        },
      },
      x: {
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div>{stockData.length > 0 && <Line data={data} options={options} />}</div>
  );
};

export default StockGraph;
