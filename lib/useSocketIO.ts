import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

/**
 * Returns Socket.io client. Call `socket.close()` to dispose the socket.
 *
 * @returns Socket.io client
 */
export function useSocketIO() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let mounted = true,
      scopedSocket: Socket;
    fetch("/api/socketio").finally(() => {
      if (!mounted) {
        return;
      }
      scopedSocket = io();
      scopedSocket.on("close", () => {
        if (mounted) {
          setSocket(null);
        }
      });
      setSocket(scopedSocket);
    });

    return () => {
      mounted = false;
      if (!scopedSocket) {
        return;
      }
      scopedSocket.close();
    };
  }, []);

  return socket;
}
