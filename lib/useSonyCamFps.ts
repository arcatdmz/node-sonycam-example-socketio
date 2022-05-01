import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SonyCamImageListener } from "./SonyCamImageListener";

export function useSonyCamFps(socket: Socket | null): number | null {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    let lastTimestamp = -1,
      intervals: number[] = [],
      lastFrameNumber: number = -1;
    const imageListener: SonyCamImageListener = ({
      frameNumber,
      timestamp,
    }) => {
      // check frame number
      if (lastFrameNumber >= 0) {
        if (frameNumber === lastFrameNumber) {
          console.error(
            `Duplicate frame number ${frameNumber} detected; duplicate event emitters?`
          );
        }
      }
      lastFrameNumber = frameNumber;

      // calculate framerate
      if (lastTimestamp >= 0) {
        const elapsed = timestamp - lastTimestamp;
        intervals.push(elapsed);
        if (intervals.length > 51) {
          intervals.shift();
        }

        // calc median
        const currentIntervals = intervals.slice().sort();
        const interval =
          currentIntervals[Math.floor(currentIntervals.length / 2)];

        if (interval > 0) {
          setFps(1000 / interval);
        }
      }
      lastTimestamp = timestamp;
    };
    socket.on("image", imageListener);
    return () => {
      socket.off("image", imageListener);
    };
  }, [socket]);

  return fps;
}
