import { ISocketMessage, IUseSocketProps } from "@/types/socketTypes";
import { useEffect, useRef, useState } from "react";


export function useSocket(props: IUseSocketProps) {

    const {region} = props;
    const [metrics, setMetrics] = useState<ISocketMessage[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        if (!region || typeof window === "undefined") return;

        setMetrics([]);

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host?.split(":")?.[0] + ":" + process.env.NEXT_PUBLIC_SOCKET_PORT;

        if (wsRef.current) {
            console.log("Closing previous connection connection");
            wsRef.current.close();
        }

        const newWs = new WebSocket(`${protocol}//${host}/websockets`);
        wsRef.current = newWs;

        newWs.addEventListener("open", () => {
            console.log("WebSocket connection opened");
            
            newWs.send(JSON.stringify({ region }));
        });

        newWs.addEventListener("message", (msg: MessageEvent) => {
            console.log("Received message:", msg.data);
            try {
                const responseMsg = JSON.parse(msg.data);
                console.log("Parsed response message:", responseMsg);
                setMetrics((prevMetrics) => {
                    // Using only the last 10 metrics
                    const newMetricsHistory = [...prevMetrics, responseMsg];
                    if (newMetricsHistory.length > 10) {
                        newMetricsHistory.shift();
                    }
                    return newMetricsHistory;
                });
            } catch (e) {
                console.log("Error parsing message:", e);
            }
        });

        newWs.addEventListener("close", () => {
            console.log("WebSocket connection closed");
        });

        newWs.addEventListener("error", (err) => {
            console.error("WebSocket error:", err);
        });

        return () => {
            if (newWs.readyState === WebSocket.OPEN) {
                newWs.close();
            }
        };
    }, [region]);

    const latestMetrics = metrics[metrics.length - 1] || null;

  return  {latestMetrics, metrics};
}