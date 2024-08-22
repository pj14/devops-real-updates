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
  ChartOptions,
} from "chart.js";
import { ISocketMessage } from "@/types/socketTypes";
import { formatTimestamp } from "@/utils/commons";
import InsightsIcon from "@mui/icons-material/Insights";
import MetricCard from "../metricCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ServerMetricsChart({
  metrics,
}: {
  metrics: ISocketMessage[];
}) {
  const activeConnectionsData = metrics.map(
    (metric) => metric.serverConnections || 0
  );
  const waitTime = metrics.map((metric) => metric.serverWaitTime || 0);
  const cpuLoadData = metrics.map(
    (metric) => (metric.serverCPULoad || 0) * 100
  );

  const timestamps = metrics.map((metric) => formatTimestamp(metric.timestamp));

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Active Connections",
        data: activeConnectionsData,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
      {
        label: "Wait Time (ms)",
        data: waitTime,
        fill: false,
        borderColor: "rgba(255,159,64,1)",
        tension: 0.1,
      },
      {
        label: "CPU Load (%)",
        data: cpuLoadData,
        fill: false,
        borderColor: "rgba(153,102,255,1)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Metrics",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <MetricCard
      heading={"Server Utilization Over Time"}
      body={
        <div className="w-[550px] mt-4 mx-auto">
          <Line data={data} options={options} />
        </div>
      }
      footer={<div></div>}
      icon={<InsightsIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#7b2f8c] to-[#d45e3d]"
    />
  );
}
