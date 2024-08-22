import React, { createContext, useContext } from "react";
import { useSocket } from "../hooks/useSocket";
import { DashboardContextType, IDashboardProps } from "@/types/dashboardTypes";
import MetricCard from "./metricCard";
import { ISocketMessage } from "@/types/socketTypes";
import ServiceCard from "./cards/serviceCard";
import UserCard from "./cards/userCard";
import ServerUtilizationCard from "./cards/serverUtilizationCard";
import WorkerCard from "./cards/workerCard";
import WorkerUtilizationChart from "./charts/workerUtilization";
import ServerMetricsChart from "./charts/serverUtilization";

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export default function Dashboard(props: IDashboardProps) {
  const { region } = props;
  const { latestMetrics, metrics } = useSocket({ region });

  console.log("log from component", latestMetrics);

  return (
    <DashboardContext.Provider
      value={{ metricData: latestMetrics, region: props.region }}
    >
      <div className="p-4 max-w-[80%] m-auto">
        <div>
          <h1 className="text-2xl h2">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-x-[10px] gap-y-[10px] justify-between py-10">
          <ServiceCard />
          <UserCard />
          <ServerUtilizationCard />
          <WorkerCard />
        </div>
        <div className="flex sm:flex-wrap gap-x-[10px] gap-y-[10px] justify-between py-10 lg:flex-nowrap">
          <ServerMetricsChart metrics={metrics} />
          <WorkerUtilizationChart metrics={metrics} />
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
