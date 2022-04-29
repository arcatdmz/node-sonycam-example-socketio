import { Server as HttpServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { SonyCam } from "node-sonycam";

export type NextApiResponseWithSonyCam = NextApiResponse & {
  socket: {
    server: HttpServer & {
      io?: SocketIOServer;
      sonycam?: SonyCam;
    };
  };
};
