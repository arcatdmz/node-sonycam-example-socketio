import http from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

const ioHandler = (
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: http.Server & {
        io: Server;
      };
    };
  }
) => {
  if (res.socket) {
    if (!res.socket.server.io) {
      console.log("*First use, starting socket.io");

      const io = new Server(res.socket.server);

      io.on("connection", (socket) => {
        socket.broadcast.emit("a user connected", socket.id);
        socket.on("hello", (msg) => {
          socket.emit("hello", msg);
        });
      });

      res.socket.server.io = io;
    } else {
      console.log("socket.io already running");
    }
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
