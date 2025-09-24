import { Message } from "../types/Chat";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MessageBubble.module.scss";
import { EventBus } from "../../game/EventBus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { addMessage } from "~/store/chat/chat.slice";
import { Chats } from "../types/Chat";

interface MessageBubbleProps {
  message: Message;
  id: string;
  onDelete?: (id: string) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function AudioMessageBubble({ message, id, onDelete }: MessageBubbleProps) {
  const isMe = message.sender === "me";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const dispatch = useDispatch();
  const currentChat = useSelector((state: RootState) => state.chat.current);
  const thankYouSentRef = useRef(false);
  const [menu, setMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [volumePanel, setVolumePanel] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const audioSrc = useMemo(() => message.audio || message.text, [message]);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      EventBus.emit("audio-chaos-stop");
    };
    const onVolume = () => {
      if (!audioRef.current) return;
      if (
        (audioRef.current.muted || audioRef.current.volume === 0) &&
        !thankYouSentRef.current
      ) {
        EventBus.emit("audio-chaos-stop");
        thankYouSentRef.current = true;
        try {
          dispatch(
            addMessage({
              chatId: currentChat as Chats,
              message: {
                sender: "other",
                type: "text",
                text: "مرسی که گوش دادی",
              },
            })
          );
        } catch {}
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("volumechange", onVolume);

    return () => {
      audio.pause();
      EventBus.emit("audio-chaos-stop");
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("volumechange", onVolume);
      audioRef.current = null;
    };
  }, [audioSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      EventBus.emit("audio-chaos-stop");
    } else {
      // If muted or volume is 0, don't start chaos; send thank-you message
      if (audio.muted || audio.volume === 0) {
        if (!thankYouSentRef.current) {
          thankYouSentRef.current = true;
          dispatch(
            addMessage({
              chatId: currentChat as Chats,
              message: {
                sender: "other",
                type: "text",
                text: "مرسی که گوش دادی",
              },
            })
          );
        }
        EventBus.emit("audio-chaos-stop");
        return;
      }
      // Emit immediately so chaos starts even if autoplay is blocked
      EventBus.emit("audio-chaos-start");
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        // if play fails, keep chaos for a moment then stop
        setTimeout(() => EventBus.emit("audio-chaos-stop"), 1200);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - bar.left) / bar.width));
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
      setProgress(ratio);
    }
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect();

      setMenu({
        visible: true,
        x: rect.right + 4, // position to the right of bubble
        y: e.clientY - rect.y - 20, // center Y position of message
      });
    }
    setVolumePanel({ visible: false, x: 0, y: 0 });
  };

  const handleShowVolume = () => {
    setVolumePanel({ visible: true, x: menu.x + 160, y: menu.y });
    setMenu({ ...menu, visible: false });
  };

  const handleDelete = () => {
    setMenu({ ...menu, visible: false });
    onDelete?.(message.id);
  };

  useEffect(() => {
    const onDocClick = () => {
      if (menu.visible) setMenu({ ...menu, visible: false });
      if (volumePanel.visible)
        setVolumePanel({ ...volumePanel, visible: false });
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menu.visible, volumePanel.visible]);

  // Clamp menu position inside viewport after render
  useEffect(() => {
    if (menu.visible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;
      let x = menu.x;
      let y = menu.y;
      if (x + rect.width + margin > vw)
        x = Math.max(margin, vw - rect.width - margin);
      if (y + rect.height + margin > vh)
        y = Math.max(margin, vh - rect.height - margin);
      if (x !== menu.x || y !== menu.y) setMenu((m) => ({ ...m, x, y }));
    }
  }, [menu.visible, menu.x, menu.y]);

  // Clamp panel position inside viewport after render
  useEffect(() => {
    if (volumePanel.visible && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;
      let x = volumePanel.x;
      let y = volumePanel.y;
      if (x + rect.width + margin > vw)
        x = Math.max(margin, vw - rect.width - margin);
      if (y + rect.height + margin > vh)
        y = Math.max(margin, vh - rect.height - margin);
      if (x !== volumePanel.x || y !== volumePanel.y)
        setVolumePanel((p) => ({ ...p, x, y }));
    }
  }, [volumePanel.visible, volumePanel.x, volumePanel.y]);

  return (
    <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
      <div
        id={id}
        ref={bubbleRef}
        onContextMenu={onContextMenu}
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
        {/* Audio control */}
        <div className="flex items-center gap-3" style={{ direction: "ltr" }}>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              backgroundColor: isMe
                ? "var(--color-primary-p-60)"
                : "var(--color-neutrals-n-20)",
              color: isMe
                ? "var(--color-neutrals-on-primary)"
                : "var(--color-neutrals-on-app-bar)",
            }}
          >
            {isPlaying ? (
              // Pause icon
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div
            className="flex-1 min-w-[140px] select-none"
            style={{ direction: "ltr" }}
          >
            <div
              className="flex items-center justify-between text-[11px] mb-1"
              style={{ opacity: 0.7 }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="w-full h-2 rounded cursor-pointer"
              onClick={handleSeek}
              style={{
                backgroundColor: isMe
                  ? "var(--color-primary-p-40)"
                  : "var(--color-neutrals-n-30)",
              }}
            >
              <div
                className="h-2 rounded"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: isMe
                    ? "var(--color-neutrals-on-primary)"
                    : "var(--color-primary-p-50)",
                  transition: "width 120ms linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Text below audio */}
        {message.text && (
          <p className="text-sm leading-relaxed mt-2">{message.text}</p>
        )}
        <p
          className="text-xs mt-1"
          style={{
            color: isMe
              ? "var(--color-neutrals-on-primary-opacity-50)"
              : "var(--color-neutrals-n-200)",
          }}
        >
          مدتی قبل...
        </p>
      </div>

      {menu.visible && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            background: "#222",
            color: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: 160,
            padding: "6px 0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-right px-4 py-2 hover:bg-gray-700"
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              width: "100%",
              direction: "rtl",
            }}
            onClick={handleShowVolume}
          >
            تغییر بلندی صدا
          </button>
          {message.deletable && (
            <button
              className="w-full text-right px-4 py-2 hover:bg-gray-700"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                width: "100%",
                direction: "rtl",
              }}
              onClick={handleDelete}
            >
              حذف پیام
            </button>
          )}
        </div>
      )}

      {volumePanel.visible && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: volumePanel.y,
            left: volumePanel.x,
            background: isMe ? "var(--color-primary-p-50)" : "#1e1e1e",
            color: isMe ? "var(--color-neutrals-on-primary)" : "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 1001,
            padding: "10px 12px",
            width: 220,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ direction: "rtl", fontSize: 12, marginBottom: 8 }}>
            تغییر بلندی صدا
          </div>
          <div className="flex items-center gap-2" style={{ direction: "ltr" }}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              {Math.round((audioRef.current?.volume || 0) * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={audioRef.current?.volume ?? 1}
              onChange={(e) => {
                const audio = audioRef.current;
                if (!audio) return;
                const v = Number(e.target.value);
                audio.muted = false;
                audio.volume = v;
              }}
              style={{ flex: 1 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioMessageBubble;

