import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka";

const password = process.env.AIVEN_PASSWORD;

if (!password) {
  throw new Error("Missing AIVEN_PASSWORD in environment variables");
}

const pub = new Redis({ //publisher
  host: "syntera-valkey-syntera.f.aivencloud.com",
  port: 18824,
  username: "default",
  password: password,
  tls: {},
});
const sub = new Redis({ //subscriber
  host: "syntera-valkey-syntera.f.aivencloud.com",
  port: 18824,
  username: "default",
  password: password,
  tls: {},
});

class SocketService {
  private _io: Server;

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

  public initListeners() {
    const io = this.io;
    console.log(`Init socket listeners...`);
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`New message received : `, message);
        //publish to redis/valkey
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
        await produceMessage(message)
        console.log(`Message produced to Kafka broker`)
      }
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
