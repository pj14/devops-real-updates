import WebSocket from "ws";
import { DashboardService } from "../services/dashboard-service";

export default async (expressServer) => {
  console.log("reching websocket server")
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    console.log("Upgrade event triggered");
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  const dashboardService = new DashboardService(websocketServer);

  return websocketServer;
};