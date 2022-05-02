import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useSonyCamStatus(socket: Socket | null) {
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    if (!socket) {
      return;
    }
    let mounted = true;
    socket.on("status", setStatus);

    fetch("/api/sonycam/isFetchingStatus").then(async (res) => {
      const json: {
        success: boolean;
        result: boolean;
      } = await res.json();
      if (!json.result) {
        await fetch("/api/sonycam/startFetchingStatus");
      }
      const statusRes = await fetch("/api/sonycam/getStatus");
      const result = (await statusRes.json()).result;
      if (mounted) {
        setStatus(result);
      }
    });

    return () => {
      mounted = false;
      socket.off("status", setStatus);
      fetch("/api/sonycam/stopFetchingStatus");
    };
  }, [socket]);
  return status;
}
