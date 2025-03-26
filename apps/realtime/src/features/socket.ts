import { ISocketMessage } from "@bitrock-town/types";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { JWT_SECRET } from "./auth";

// Creates a new WebSocket connection to the specified URL.
const socket = new WebSocketServer({
  ...(process.env.PORT && { port: parseInt(process.env.PORT) }),
});

async function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET ?? "", (err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

socket.on("connection", async (ws, req) => {
  console.log("Client connected");

  const token = req.url?.split("token=")[1];

  if (!JWT_SECRET || !token) {
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
