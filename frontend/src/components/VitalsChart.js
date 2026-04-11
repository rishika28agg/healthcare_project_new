import React from "react";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function VitalsChart({ records }) {
  if (!records.length) return <p>No data</p>;

  const labels = records.slice(0, 10).map((_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Heart Rate",
        data: records.map((r) => r.heart_rate),
        borderColor: "red",
      },
      {
        label: "SpO2",
        data: records.map((r) => r.spo2),
        borderColor: "blue",
      },
      {
        label: "Temperature",
        data: records.map((r) => r.body_temperature),
        borderColor: "green",
      },
    ],
  };

  return <Line data={data} />;
}

export default VitalsChart;