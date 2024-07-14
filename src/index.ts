import { WebSocketServer, WebSocket } from "ws";
import { UserManager } from "./UserManager";

import url from "url";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const paramsUrl = url.parse(req.url as string).query || "";
  const params = Object.fromEntries([...new URLSearchParams(paramsUrl)]);
  const { id, name }: { [k: string]: string } = params;
  if (!id || !name) {
    ws.close();
    console.log("Id and name not present");
    return;
  }
  UserManager.getInstance().addUser(ws, id, name);
  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
     // console.log("DATA", data);
      switch (data.type) {
        case "pingAll":
          UserManager.getInstance().pingAllUsers(data.from);
          break;
        case "pingUser":
          UserManager.getInstance().pingUser(data.from, data.to);
          break;
        default:
          console.log("Invalid data.type");
      }
    } catch (error) {
      console.log("Error Processing request", error);
    }
  });

  ws.on("error", (err) => {
    console.log(err);
  });

  ws.on("close", () => {
    const connectedUsers = UserManager.getInstance().getConnectedUsers();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "connectedUsers",
            connectedUsers,
          })
        );
      }
    });
  });

  const connectedUsers = UserManager.getInstance().getConnectedUsers();
  ws.send(
    JSON.stringify({
      type: "connectedUsers",
      connectedUsers,
    })
  );
});
const interval = setInterval(function ping() {
  const connectedUsers = UserManager.getInstance().getConnectedUsers();
  wss.clients.forEach(function each(ws) {
    ws.send(
      JSON.stringify({
        type: "connectedUsers",
        connectedUsers,
      })
    );
  });
}, 5000);

wss.on("close", function close() {
  clearInterval(interval);
});
