import { Server } from "socket.io";
import { NextApiResponseWithSocketIO } from "./NextApiResponseWithSocketIO";

export function ensureSocketIOServer(
  res: NextApiResponseWithSocketIO
): Server | null {
  if (!res.socket) {
    return null;
  }
  if (!res.socket.server.io) {
    console.log("*First use, starting Socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected", socket.id);
      socket.on("hello", (msg) => {
        socket.emit("hello", msg);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already running");
  }
  return res.socket.server.io;
}
