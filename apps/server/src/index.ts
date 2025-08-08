import "dotenv/config";
import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";

async function init() {
  startMessageConsumer()
  const socketService = new SocketService();
  const httpServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Server is running");
  });
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log("Server listening at port:", PORT);
  });

  socketService.initListeners();
}

init();
