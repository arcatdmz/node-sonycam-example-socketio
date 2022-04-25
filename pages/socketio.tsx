import { NextPage } from "next";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

const SocketIoPage: NextPage = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let mounted = true,
      socket: Socket;
    fetch("/api/socketio").finally(() => {
      if (!mounted) {
        return;
      }
      socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello", "from client");
      });

      socket.on("hello", (msg) => {
        console.log("client received hello", msg);
      });

      socket.on("a user connected", (id) => {
        console.log("a user connected", id);
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });

    return () => {
      mounted = false;
      if (!socket) {
        return;
      }
      socket.close();
    };
  }, []);

  return <h1>Socket.io</h1>;
};

export default SocketIoPage;
