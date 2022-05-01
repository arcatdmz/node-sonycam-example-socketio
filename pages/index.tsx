/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { SonyCamImageListener } from "../lib/SonyCamImageListener";
import { useSocketIO } from "../lib/useSocketIO";
import { useSonyCamFps } from "../lib/useSonyCamFps";

import styles from "../styles/Index.module.css";

const SocketIoPage: NextPage = () => {
  const socket = useSocketIO();
  const fps = useSonyCamFps(socket);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const imageListener: SonyCamImageListener = ({ data }) => {
      setMessage(null);
      setObjectUrl((oldUrl) => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        const blob = new Blob([data], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      });
    };
    socket.on("image", imageListener);
    socket.on("sonycam", setMessage);

    fetch("/api/sonycam/init").then(async (res) => {
      const json: {
        success: boolean;
      } = await res.json();
      if (json.success) {
        fetch("/api/sonycam/startLiveview");
      }
    });

    return () => {
      socket.off("image", imageListener);
      socket.off("sonycam", setMessage);
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      <span className={styles.fps}>
        <span className={styles.number}>
          {typeof fps === "number" ? Math.round(fps) : "-"}
        </span>{" "}
        fps
      </span>
      <p>
        {message ||
          (objectUrl ? (
            <img src={objectUrl} alt="liveview" />
          ) : (
            "no image available"
          ))}
      </p>
    </div>
  );
};

export default SocketIoPage;
