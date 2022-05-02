/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { SonyCamStatusControls } from "../components/SonyCamStatusControls";
import { SonyCamImageListener } from "../lib/SonyCamImageListener";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";
import { useSocketIO } from "../lib/useSocketIO";
import { useSonyCamFps } from "../lib/useSonyCamFps";
import { useSonyCamPlaying } from "../lib/useSonyCamPlaying";
import { useSonyCamStatus } from "../lib/useSonyCamStatus";

import styles from "../styles/Index.module.css";

const SocketIoPage: NextPage = () => {
  const socket = useSocketIO();
  const fps = useSonyCamFps(socket);
  const playing = useSonyCamPlaying(socket);
  const status = useSonyCamStatus(socket);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [overlayDisabled, setOverlayDisabled] = useState<boolean>(false);
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
    const statusChangeListener = () => {
      setOverlayDisabled(true);
    };
    socket.on("statusChange", statusChangeListener);
    socket.on("sonycam", setMessage);
    socket.on("statusListenerEnabled", setOverlayDisabled);

    fetch("/api/sonycam/init").then(async (res) => {
      const json: {
        success: boolean;
      } = await res.json();
      setInitialized(json.success);
    });

    return () => {
      socket.off("image", imageListener);
      socket.off("statusChange", statusChangeListener);
      socket.off("sonycam", setMessage);
      socket.off("statusListenerEnabled", setOverlayDisabled);
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

  const handleOverlayClick = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    fetch("/api/sonycam/startFetchingStatus");
  }, []);

  return (
    <SonyCamStatusContext.Provider value={status}>
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
        <div className={[styles.status, styles.box].join(" ")}>
          {!overlayDisabled && (
            <div className={styles.overlay} onClick={handleOverlayClick}>
              <Button icon="play" circular inverted />
            </div>
          )}
          <SonyCamStatusControls />
        </div>
        <p>
          {message ||
            (objectUrl ? (
              <img src={objectUrl} alt="liveview" />
            ) : (
              "No image available"
            ))}
        </p>
      </div>
    </SonyCamStatusContext.Provider>
  );
};

export default SocketIoPage;
