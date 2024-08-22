import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import CircleIcon from "@mui/icons-material/Circle";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import MetricCard from "../metricCard";

export default function ServiceCard() {
  const context = useContext(DashboardContext);

  const metricData = context?.metricData;

  const redisService = metricData?.redisServiceStatus;
  const databaseService = metricData?.databaseServiceStatus;

  let footerText = "";
  let footerFlag = true;
  if (redisService && databaseService) {
    footerText = "Both service up";
  } else {
    footerText = "Service issue flagged";
    footerFlag = false;
  }

  const footerComp = (
    <div className={`${footerFlag ? "text-green-500" : "text-red-600"} m-auto`}>
      {footerText}
    </div>
  );

  const serviceComp = (
    <div className="mt-4">
      <div className="flex justify-between gap-2 text-xl text-[#3C4858]">
        <span>Redis</span>
        <span>
          <CircleIcon
            className={`text-xs ${
              redisService ? "text-green-500" : "text-red-600"
            }`}
          />
        </span>
      </div>
      <div className="flex justify-between gap-2 text-xl text-[#3C4858] mt-4">
        <span>Database</span>
        <span>
          <CircleIcon
            className={`text-xs ${
              databaseService ? "text-green-500" : "text-red-600"
            }`}
          />
        </span>
      </div>
    </div>
  );

  return (
    <MetricCard
      heading="Services"
      body={serviceComp}
      footer={footerComp}
      icon={<MiscellaneousServicesIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#ffa726] to-[#fb8c00]"
    />
  );
}
