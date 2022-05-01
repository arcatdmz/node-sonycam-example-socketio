/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { SonyCamImageListener } from "../lib/SonyCamImageListener";
import { useSocketIO } from "../lib/useSocketIO";
import { useSonyCamFps } from "../lib/useSonyCamFps";
import { useSonyCamPlaying } from "../lib/useSonyCamPlaying";

import styles from "../styles/Index.module.css";

const SocketIoPage: NextPage = () => {
  const socket = useSocketIO();
  const fps = useSonyCamFps(socket);
  const playing = useSonyCamPlaying(socket);
  const [initialized, setInitialized] = useState<boolean>(false);
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
      setInitialized(json.success);
    });

    return () => {
      socket.off("image", imageListener);
      socket.off("sonycam", setMessage);
    };
  }, [socket]);

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      setInitialized(false);
      fetch(
        playing ? "/api/sonycam/stopLiveview" : "/api/sonycam/startLiveview"
      ).finally(() => {
        setInitialized(true);
        if (playing) {
          setObjectUrl(
            (oldUrl) => (oldUrl && URL.revokeObjectURL(oldUrl)) || null
          );
        }
      });
      return false;
    },
    [playing]
  );

  return (
    <div className={styles.body}>
      <span className={[styles.fps, styles.box].join(" ")}>
        <span className={styles.number}>
          {playing && typeof fps === "number" ? Math.round(fps) : "-"}
        </span>{" "}
        fps
      </span>
      <span className={[styles.control, styles.box].join(" ")}>
        <Button
          icon={playing ? "stop" : "play"}
          color="grey"
          disabled={!initialized}
          onClick={handleClick}
        />
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
