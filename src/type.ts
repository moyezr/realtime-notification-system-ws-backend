export interface MessageType {
  type: "ping" | "pingAll" | "getActiveUsers" | "message" |  "disconnected";
  usersToPing: string[] | undefined;
  token: string;
  from: string | undefined;
  to: string | undefined
}

export interface OutgoingMessage {
  sender: string;
  type: "message";
}
