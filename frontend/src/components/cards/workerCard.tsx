import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MetricCard from "../metricCard";

export default function WorkerCard() {
  const context = useContext(DashboardContext);

  const metricData = context?.metricData;

  const workers = metricData?.workers || [];

  console.log("workers workers ", workers);

  const getWorkersInfo = (taskName: string) => {
    const workerInfo = workers.find((worker) => worker[0] === taskName);
    return workerInfo ? workerInfo[1] : { workers: 0, idle: 0 };
  };

  const ioWorkers = getWorkersInfo("io");
  const recordingWorkers = getWorkersInfo("recording-workers");

  const totalWorkers = workers.reduce(
    (sum, worker) => sum + (worker[1].workers || 0),
    0
  );
  const totalIdleWorkers = workers.reduce(
    (sum, worker) => sum + (worker[1].idle || 0),
    0
  );

  const otherWorkersCount =
    totalWorkers - (ioWorkers.workers || 0) - (recordingWorkers.workers || 0);

  const workersComp = (
    <div>
      <div className="text-right">
        <span className="text-3xl text-[#3C4858]">
          {totalWorkers}/{totalIdleWorkers}
        </span>
      </div>
      <div className="flex justify-between">
        <span>IO:</span>
        <span>
          {ioWorkers.workers || 0} total / {ioWorkers.idle || 0} idle
        </span>
      </div>
      <div className="flex justify-between">
        <span>Recording:</span>
        <span>
          {recordingWorkers.workers || 0} total / {recordingWorkers.idle || 0}{" "}
          idle
        </span>
      </div>
      <div className="flex justify-between">
        <span>Other:</span>
        <span>{otherWorkersCount} total</span>
      </div>
    </div>
  );

  let footerText;
  let footerFlag = true;

  if (totalIdleWorkers > totalWorkers * 0.8) {
    footerText = "High idle workers consider scaling down";
    footerFlag = false;
  }
  if (totalIdleWorkers > totalWorkers * 0.8) {
    footerText = "High idle workers consider scaling down";
    footerFlag = false;
  } else {
    footerText = "Worker distribution is balanced.";
  }

  const footerComp = (
    <div
      className={` ${footerFlag ? "text-green-500" : "text-red-600"} m-auto`}
    >
      {footerText}
    </div>
  );

  return (
    <MetricCard
      heading="Workers Utilization (Total/Idle)"
      body={workersComp}
      icon={<EngineeringIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#42a5f5] to-[#2196f3]"
      footer={footerComp}
    />
  );
}
