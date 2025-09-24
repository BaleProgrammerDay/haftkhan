import { Message } from "../types/Chat";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MessageBubble.module.scss";

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
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [audioSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        // autoplay prevented or error
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

  return (
    <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
      <div
        id={id}
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-[140px] select-none" style={{ direction: "ltr" }}>
            <div className="flex items-center justify-between text-[11px] mb-1" style={{opacity: 0.7}}>
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
    </div>
  );
}

export default AudioMessageBubble;


