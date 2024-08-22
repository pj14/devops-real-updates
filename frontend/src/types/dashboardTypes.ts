import { ISocketMessage } from "./socketTypes";

export interface DashboardContextType {
    metricData: ISocketMessage | null;
    region: string | "";
}

export interface IDashboardProps {
    region: string | "";
}

export interface IMetricCardProps {
    icon: React.ReactNode | null;
    heading: string;
    body: React.ReactNode | null;
    footer: React.ReactNode | null;
    backgroundColor: string
}