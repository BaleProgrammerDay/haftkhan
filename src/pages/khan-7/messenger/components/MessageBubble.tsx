import { Message } from "../types/Chat";
import React, { useState, useRef, useEffect } from "react";
import styles from "./MessageBubble.module.scss";
import { EventBus } from "../../game/EventBus";

interface MessageBubbleProps {
  message: Message;
  id: string;
  onDelete?: (id: string) => void;
}

function MessageBubble({ message, id, onDelete }: MessageBubbleProps) {
  const isMe = message.sender === "me";
  const [menu, setMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => setMenu({ ...menu, visible: false });
    if (menu.visible) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [menu.visible]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!message.deletable) return;
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    setMenu({ ...menu, visible: false });
    onDelete?.(message.id);
    EventBus.emit("deleted");
  };

  return (
    <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
      <div
        id={id}
        ref={bubbleRef}
        onContextMenu={handleContextMenu}
        className={
          `max-w-xs lg:max-w-md px-4 py-2 shadow-sm ` +
          (isMe ? styles["pixel-bubble-me"] : styles["pixel-bubble-other"])
        }
        style={{
          backgroundColor: isMe
            ? "var(--color-primary-p-50)"
            : "var(--color-neutrals-surface)",
          color: isMe
            ? "var(--color-neutrals-on-primary)"
            : "var(--color-neutrals-on-app-bar)",
          borderColor: !isMe ? "var(--color-neutrals-n-30)" : "transparent",
          borderWidth: !isMe ? "1px" : "0px",
          borderStyle: !isMe ? "solid" : "none",
          direction: message.ltr ? "ltr" : "rtl",
          fontStyle: message.ltr ? "italic" : "normal",
        }}
      >
        {message.sender === "other" || isMe ? null : <p>{message.sender}</p>}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className="text-xs mt-1"
          style={{
            color: isMe
              ? "var(--color-neutrals-on-primary-opacity-50)"
              : "var(--color-neutrals-n-200)",
          }}
        >
          {/* {new Date(message.time).toLocaleString()} */}
          مدتی قبل...
        </p>
      </div>
      {menu.visible && (
        <div
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            background: "#222",
            color: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: 120,
            padding: "6px 0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              width: "100%",
            }}
            onClick={handleDelete}
          >
            حذف پیام
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
