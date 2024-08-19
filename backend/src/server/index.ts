import WebSocket from "ws";
import qs from "qs";

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

  websocketServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      console.log("connection started")
      const [_path, params] = connectionRequest?.url?.split("?") || ["", ""];
      const connectionParams = qs.parse(params);

      console.log("_path", _path);
      console.log("connectionParams", connectionParams);

      websocketConnection.on("message", (message : string) => {
        //const parsedMessage = JSON.parse(message);
        console.log(message);
      });
    }
  );

  return websocketServer;
};