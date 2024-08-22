import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { ISocketMessage } from "@/types/socketTypes";
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
import { formatTimestamp } from "@/utils/commons";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
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

export default function WorkerUtilizationChart({
  metrics,
}: {
  metrics: ISocketMessage[];
}) {
  const chartRef = useRef(null);

  const ioWorkersData = metrics.map((metric) => {
    const ioWorker = metric.workers.find((worker) => worker[0] === "io");
    return ioWorker ? ioWorker[1].workers : 0;
  });

  const idleWorkersData = metrics.map((metric) => {
    const ioWorker = metric.workers.find((worker) => worker[0] === "io");
    return ioWorker ? ioWorker[1].idle : 0;
  });

  const timestamps = metrics.map((metric) => formatTimestamp(metric.timestamp));

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Total IO Workers",
        data: ioWorkersData,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
      {
        label: "Idle IO Workers",
        data: idleWorkersData,
        fill: false,
        borderColor: "rgba(255,99,132,1)",
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
          text: "Number of Workers",
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
          <Line ref={chartRef} data={data} options={options} />
        </div>
      }
      footer={<div></div>}
      icon={<QueryStatsIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#29a19c] to-[#f4c430]"
    />
  );
}
