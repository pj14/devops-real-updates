import React, { useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Divider,
  CardFooter,
} from "@nextui-org/react";
import { IMetricCardProps } from "@/types/dashboardTypes";
import { DashboardContext } from "./dashboard";

export default function MetricCard(props: IMetricCardProps) {
  const { heading, body, footer, icon, backgroundColor } = props;
  return (
    <Card
      className="py-4 grow shrink 
        md:basis-full lg:basis-0 bg-[#ebf3fb] 
        rounded-xl flex flex-col 
        justify-between 
        shadow-[10px_10px_10px_-1px_rgba(224,224,224,0.77)]"
    >
      <CardHeader className="block pb-0 pt-2 px-4 flex-col items-start">
        <div
          className={`float-left p-4 mt-[-26px] mr-4 rounded-[4px] bg-gray-900 ${backgroundColor}`}
        >
          <span>{icon}</span>
        </div>
        <p className="text-tiny font-semibold text-right text-[#777]">
          {heading}
        </p>
        <div className="py-4">{body}</div>
      </CardHeader>
      <div>
        <Divider className="border-solid" />
        <CardFooter>{footer}</CardFooter>
      </div>
    </Card>
  );
}
