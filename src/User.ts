import { WebSocket } from "ws";

export class User {
  private id: string;
  private ws: WebSocket;
  public name: string;

  constructor(id: string, ws: WebSocket, name: string) {
    this.id = id;
    this.ws = ws;
    this.name = name;

  }

  public getName(): string {
    return this.name;
  }

  public ping(message: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }

}
