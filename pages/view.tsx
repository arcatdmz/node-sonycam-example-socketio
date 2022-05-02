/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SonyCamImageListener } from "../lib/SonyCamImageListener";
import { useSocketIO } from "../lib/useSocketIO";

import styles from "../styles/Index.module.css";

const ViewPage: NextPage = () => {
  const socket = useSocketIO();
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

    return () => {
      socket.off("image", imageListener);
      socket.off("sonycam", setMessage);
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      <p>
        {message ||
          (objectUrl ? (
            <img src={objectUrl} alt="liveview" />
          ) : (
            "No image available"
          ))}
      </p>
    </div>
  );
};

export default ViewPage;
