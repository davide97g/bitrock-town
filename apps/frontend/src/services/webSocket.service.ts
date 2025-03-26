import { ISocketMessage } from "@bitrock-town/types";

class WebSocketService {
  private socket: WebSocket | null = null;
  private onMessageCallback: ((message: ISocketMessage) => void) | null = null;

  connect(url: string) {
    if (this.socket) return; // Prevent duplicate connections

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(JSON.parse(event.data) as ISocketMessage);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.socket = null;
    };
  }

  sendMessage(message: ISocketMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  setOnMessageCallback(callback: (message: ISocketMessage) => void) {
    this.onMessageCallback = callback;
  }
}

export const websocketService = new WebSocketService();
