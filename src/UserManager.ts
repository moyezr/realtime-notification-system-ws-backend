import { WebSocket } from "ws";
import { User } from "./User";

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, User> = new Map();
  private connectedUsers: { [key: string]: string } = {};

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  public addUser(ws: WebSocket, id: string, name: string) {
    const user = new User(id, ws, name);
    this.users.set(id, user);
    this.connectedUsers[id] = name;
    this.registerOnClose(ws, id);
    return user;
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", () => {
      //console.log("deleteing user");
      this.users.delete(id);
      delete this.connectedUsers[id];
    });
  }

  public getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  public pingAllUsers(senderId: string) {
    //console.log("pinging all users", this.users.keys());
    try {
      const userName = UserManager.getInstance().getName(senderId);
      const message = JSON.stringify({ type: "ping", sender: userName });
      for (const key of this.users.keys()) {
        if (key != senderId) {
          this.getUser(key)?.ping(message);
        }
      }
    } catch (error) {
      console.error("ERROR PINGING ALL USERS");
    }
  }

  public getName(id: string) {
    return this.users.get(id)?.name;
  }
  public pingUser(senderId: string, receiverId: string) {
    const receiver = this.getUser(receiverId);
    const senderName = this.getName(senderId);
    if (!receiver) return;
    receiver.ping(JSON.stringify({ type: "ping", sender: senderName }));
  }

  public getConnectedUsers() {
    //console.log(this.connectedUsers);
    return this.connectedUsers;
  }
}
