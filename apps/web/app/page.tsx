"use client";

import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const boxRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const bottom = bottomRef.current;
    if (!box || !bottom) return;

    const isNearBottom =
      box.scrollHeight - box.scrollTop - box.clientHeight < 100;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        bottom.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]);

  return (
    <div className={classes.container}>
      <h1 className={classes.logo}>SYNTREA</h1>
      <p className={classes.description}>
        Real-time chat application powered by WebSockets and Valkey.
      </p>

      <div className={classes["message-box"]} ref={boxRef}>
        {messages.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={classes["input-area"]}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const trimmed = message.trim();
              if (trimmed !== "") {
                sendMessage(trimmed);
                setMessage("");
              }
            }
          }}
          type="text"
          className={classes["chat-input"]}
          placeholder="Enter message.."
        />
        <button
          onClick={() => {
            const trimmed = message.trim();
            if (trimmed !== "") {
              sendMessage(trimmed);
              setMessage("");
            }
          }}
          className={classes["button"]}
          type="button"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
