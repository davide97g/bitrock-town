import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyToken } from "../middleware/verifyToken";

// Create HTTP server
const server = createServer();

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store clients and their room associations
const clients = new Map();
const rooms = new Map();

// Handle WebSocket connections
wss.on("connection", async (ws, req) => {
  console.log("Client connected");

  const token = req.url?.split("token=")[1];

  const isBitstream =
    req.headers.origin?.includes("localhost:3003") ||
    req.headers.origin?.includes("stream.bitrock.town");

  if (!isBitstream) {
    if (!token) {
      console.log("Client disconnected due to bad server configuration");
      return ws.close();
    }

    const user = await verifyToken(token);
    if (!user) {
      console.log("Client disconnected due to invalid token");
      return ws.close();
    }
  }

  // Generate a unique ID for this client
  const clientId = generateId();
  clients.set(ws, { id: clientId, room: null });

  // Handle messages from clients
  ws.on("message", (message) => {
    try {
      // Parse the message
      const data = JSON.parse(message.toString());
      console.log(`Received message from ${clientId}:`, data.type);

      // Handle different message types
      switch (data.type) {
        case "join":
          handleJoin(ws, data.roomId);
          break;

        case "leave":
          handleLeave(ws);
          break;

        case "offer":
          relayMessage(ws, data);
          break;

        case "answer":
          relayMessage(ws, data);
          break;

        case "ice-candidate":
          relayMessage(ws, data);
          break;

        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    handleLeave(ws);
    clients.delete(ws);
    console.log(`Client ${clientId} disconnected`);
  });

  // Send the client their ID
  ws.send(
    JSON.stringify({
      type: "connected",
      userId: clientId,
    }),
  );
});

// Handle a client joining a room
function handleJoin(ws: WebSocket, roomId: string) {
  const client = clients.get(ws);

  // Leave current room if in one
  if (client.room) {
    handleLeave(ws);
  }

  // Join new room
  client.room = roomId;

  // Create room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  // Add client to room
  rooms.get(roomId).add(ws);

  // Notify other clients in the room
  notifyPeers(ws, roomId);

  console.log(`Client ${client.id} joined room ${roomId}`);
}

// Handle a client leaving a room
function handleLeave(ws: WebSocket) {
  const client = clients.get(ws);
  if (!client || !client.room) return;

  const roomId = client.room;
  const room = rooms.get(roomId);

  if (room) {
    // Remove client from room
    room.delete(ws);

    // Delete room if empty
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    } else {
      // Notify other clients that this client left
      for (const peer of room) {
        peer.send(
          JSON.stringify({
            type: "user-left",
            userId: client.id,
          }),
        );
      }
    }
  }

  // Update client state
  client.room = null;
  console.log(`Client ${client.id} left room ${roomId}`);
}

// Notify peers in a room about a new client
function notifyPeers(ws: WebSocket, roomId: string) {
  const client = clients.get(ws);
  const room = rooms.get(roomId);

  if (!room) return;

  // Notify existing clients about the new client
  for (const peer of room) {
    if (peer !== ws) {
      // Tell the new client about this existing peer
      ws.send(
        JSON.stringify({
          type: "user-joined",
          userId: clients.get(peer).id,
        }),
      );

      // Tell the existing peer about the new client
      peer.send(
        JSON.stringify({
          type: "user-joined",
          userId: client.id,
        }),
      );
    }
  }
}

// Relay a message to the intended recipient
function relayMessage(ws: WebSocket, data: any) {
  const sender = clients.get(ws);
  if (!sender || !sender.room) return;

  const room = rooms.get(sender.room);
  if (!room) return;

  // Find the target client
  for (const peer of room) {
    const peerClient = clients.get(peer);

    // Send to the specific peer if userId is specified
    if (data.userId && peerClient.id === data.userId) {
      // Add sender ID to the message
      const message = {
        ...data,
        userId: sender.id,
      };

      peer.send(JSON.stringify(message));
      return;
    }
  }
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Realtime BitRock WebSocket server is running on port ${PORT}`);
});
