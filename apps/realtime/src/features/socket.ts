import { ISocketMessage } from "@bitrock-town/types";
import { WebSocketServer } from "ws";
import { verifyToken } from "../middleware/verifyToken";

// Creates a new WebSocket connection to the specified URL.
const socket = new WebSocketServer({
  ...(process.env.PORT && { port: parseInt(process.env.PORT) }),
});

socket.on("connection", async (ws, req) => {
  console.log("Client connected");

  const token = req.url?.split("token=")[1];

  if (!token) {
    console.log("Client disconnected due to bad server configuration");
    return ws.close();
  }

  const user = await verifyToken(token);

  if (!user) {
    console.log("Client disconnected due to invalid token");
    return ws.close();
  }

  console.log("User connected:", user);

  ws.on("message", (message) => {
    const socketMessage = JSON.parse(message.toString()) as ISocketMessage;
    if (socketMessage.event === "position") {
      broadcast(socketMessage);
      return;
    }
    ws.send(`Received message: ${message.toString()}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

export function broadcast(message: ISocketMessage) {
  socket.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
