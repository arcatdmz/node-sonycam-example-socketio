import { useEffect } from "react";
import { Socket } from "socket.io-client";

export function useSocketIODebugConsoleMessages(socket: Socket): void {
  useEffect(() => {
    if (!socket) {
      return;
    }
    const listeners = {
      onConnect: () => {
        console.log("connect");
        socket.emit("hello", "from client");
      },
      onHello: (msg: string) => {
        console.log("client received hello", msg);
      },
      onUserConnect: (id: string) => {
        console.log("a user connected", id);
      },
      onDisconnect: () => {
        console.log("disconnect");
      },
    };
    socket.on("connect", listeners.onConnect);
    socket.on("hello", listeners.onHello);
    socket.on("a user connected", listeners.onUserConnect);
    socket.on("disconnect", listeners.onDisconnect);
    return () => {
      socket.off("connect", listeners.onConnect);
      socket.off("hello", listeners.onHello);
      socket.off("a user connected", listeners.onUserConnect);
      socket.off("disconnect", listeners.onDisconnect);
    };
  }, [socket]);
}
