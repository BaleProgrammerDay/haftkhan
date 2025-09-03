import React from "react";
import { Message } from "../types/Chat";

interface MessageBubbleProps {
    message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
    const isMe = message.sender === "me";

    return (
        <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    isMe ? "rounded-br-md" : "rounded-bl-md"
                }`}
                style={{
                    backgroundColor: isMe
                        ? "var(--color-primary-p-50)"
                        : "var(--color-neutrals-surface)",
                    color: isMe
                        ? "var(--color-neutrals-on-primary)"
                        : "var(--color-neutrals-on-app-bar)",
                    borderColor: !isMe
                        ? "var(--color-neutrals-n-30)"
                        : "transparent",
                    borderWidth: !isMe ? "1px" : "0px",
                    borderStyle: !isMe ? "solid" : "none",
                }}
            >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                    className="text-xs mt-1"
                    style={{
                        color: isMe
                            ? "var(--color-neutrals-on-primary-opacity-50)"
                            : "var(--color-neutrals-n-200)",
                    }}
                >
                    {message.time}
                </p>
            </div>
        </div>
    );
}

export default MessageBubble;
