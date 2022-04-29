import { Server as HttpServer } from "http";
import { NextApiResponse } from "next";
import { SonyCam } from "node-sonycam";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseWithSonyCam } from "./NextApiResponseWithSonyCam";

export function checkSonyCam(
  res: NextApiResponseWithSonyCam
): res is NextApiResponse & {
  socket: {
    server: HttpServer & {
      io: SocketIOServer;
      sonycam: SonyCam;
    };
  };
} {
  if (!res.socket) {
    res.json({
      success: false,
      message: "Socket disconnected",
    });
    return false;
  }
  if (!res.socket.server.io) {
    res.json({
      success: false,
      message: "Socket.io not initialized",
    });
    return false;
  }
  if (!res.socket.server.sonycam) {
    res.json({
      success: false,
      message: "SonyCam not initialized",
    });
    return false;
  }
  return true;
}
