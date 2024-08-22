import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import MetricCard from "../metricCard";

export default function ServerUtilizationCard() {
  const context = useContext(DashboardContext);

  const metricData = context?.metricData;

  const serversCount = metricData?.serverCount || 0;
  const activeConnections = metricData?.serverConnections || 0;
  const cpuLoad = metricData?.serverCPULoad || 0;

  let footerText = "";

  const cpuLoadColor = () => {
    if (cpuLoad < 0.5) {
      footerText = "CPU Optimal. No Action.";
      return "text-green-500";
    }
    if (cpuLoad >= 0.5 && cpuLoad < 0.75) {
      footerText = "CPU Overloading. Scale Up.";
      return "text-yellow-500";
    }
    if (cpuLoad >= 0.75 && cpuLoad < 0.9) {
      footerText = "CPU Overload. Add Servers";
      return "text-orange-500";
    }

    footerText = "CPU Over utilized.";
    return "text-red-600";
  };

  const serverUtilizationComp = (
    <div>
      <div className="flex justify-between text-[#3C4858] mt-4">
        <span>Servers Count:</span>
        <span>{serversCount}</span>
      </div>
      <div className="flex justify-between text-[#3C4858] mt-4">
        <span>Active Connections:</span>
        <span>{activeConnections}</span>
      </div>
      <div className="flex justify-between text-[#3C4858] mt-4">
        <span>CPU Load:</span>
        <span className={cpuLoadColor()}>{(cpuLoad * 100).toFixed(2)}%</span>
      </div>
    </div>
  );

  const footerComp = (
    <div className={`${cpuLoadColor()} m-auto`}>{footerText}</div>
  );

  return (
    <MetricCard
      heading="Server Utilization"
      body={serverUtilizationComp}
      icon={<StorageIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#26a69a] to-[#2bbbad]"
      footer={footerComp}
    />
  );
}
