import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MetricCard from "../metricCard";

export default function UserCard() {
  const context = useContext(DashboardContext);

  const metricData = context?.metricData;

  const onlineUsers = metricData?.onlineUsers || 0;
  const activeSessions = metricData?.activeSessions || 0;

  const percentageActive = (activeSessions / onlineUsers) * 100;

  let color;
  let footerText;

  if (isNaN(percentageActive)) {
    color = "text-rose-950";
    footerText = "Error getting user numbers.";
  } else {
    color = "text-green-500";
    footerText = `${percentageActive.toFixed(2)}% of active users.`;
  }

  const footerComp = <div className={`${color} m-auto`}>{footerText}</div>;

  const userComp = (
    <div className="text-right mt-4">
      <span className="text-3xl text-[#3C4858]">
        {activeSessions}/{onlineUsers}
      </span>
    </div>
  );

  return (
    <MetricCard
      heading="Active/Online Users"
      body={userComp}
      footer={footerComp}
      icon={<PeopleIcon htmlColor="white" />}
      backgroundColor="bg-gradient-to-tr from-[#66bb6a] to-[#43a047]"
    />
  );
}
