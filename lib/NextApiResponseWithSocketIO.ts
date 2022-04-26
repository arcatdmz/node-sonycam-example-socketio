import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseWithSocketIO = NextApiResponse & {
  socket: {
    server: HttpServer & {
      io: SocketIOServer;
    };
  };
};
