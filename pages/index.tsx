/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import styles from "../styles/Index.module.css";

const SocketIoPage: NextPage = () => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

      socket.on(
        "image",
        ({
          // frameNumber,
          // timestamp,
          // dataSize,
          data,
        }: {
          frameNumber: number;
          timestamp: number;
          dataSize: number;
          data: ArrayBuffer;
        }) => {
          setMessage(null);
          setObjectUrl((oldUrl) => {
            if (oldUrl) {
              URL.revokeObjectURL(oldUrl);
            }
            const blob = new Blob([data], { type: "image/jpeg" });
            return URL.createObjectURL(blob);
          });
        }
      );

      socket.on("sonycam", setMessage);

      fetch("/api/sonycam/init").then(async (res) => {
        const json: {
          success: boolean;
        } = await res.json();
        if (json.success) {
          fetch("/api/sonycam/startLiveview");
        }
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

  return (
    <div className={styles.body}>
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
