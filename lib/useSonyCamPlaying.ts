import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useSonyCamPlaying(socket: Socket | null) {
  const [playing, setPlaying] = useState<boolean>(false);
  useEffect(() => {
    if (!socket) {
      return;
    }
    let mounted = true;
    socket.on("play", setPlaying);

    fetch("/api/sonycam/isLiveviewing").then(async (res) => {
      const json: {
        success: boolean;
        result: boolean;
      } = await res.json();
      if (mounted) {
        setPlaying(json.result);
      }
    });

    return () => {
      mounted = false;
      socket.off("play", setPlaying);
    };
  }, [socket]);
  return playing;
}
