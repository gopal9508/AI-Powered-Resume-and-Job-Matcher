import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Stats = ({ history = [] }) => {
  // 🛡️ Safety check (prevents white page)
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div style={cardStyle}>
        <h3>📈 Match Score Trend</h3>
        <p>No analysis data available yet.</p>
      </div>
    );
  }

  // Prepare chart labels & data
  const labels = history.map((item) =>
    new Date(item.createdAt).toLocaleDateString()
  );

  const scores = history.map((item) =>
    typeof item.matchScore === "number" ? item.matchScore : 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Match Score (%)",
        data: scores,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        title: {
          display: true,
          text: "Match Score (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div style={cardStyle}>
      <h3>📈 Match Score Trend</h3>
      <Line data={data} options={options} />
    </div>
  );
};

// 🎨 Simple card styling
const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  background: "#f9fafb",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

export default Stats;
