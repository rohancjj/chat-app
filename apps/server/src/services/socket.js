import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-18415.c240.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 18415,
  username: "default",
  password: "r51pA9LTlXbLlGHH8zsYWRJV5UTXPOJl",
});

const sub = new Redis({
  host: "redis-18415.c240.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 18415,
  username: "default",
  password: "r51pA9LTlXbLlGHH8zsYWRJV5UTXPOJl",
});

class SocketService {
  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected: ${socket.id}`);

      socket.on("event:message", async ({ message }) => {
        console.log("New Message Received:", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New message from Redis:", message);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
