import React, { useMemo } from "react";
import { Chat, ChatState } from "../types/Chat";
import clsx from "clsx";

interface ChatItemProps {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
}

function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
    const lastMessage = chat.messages[chat.messages.length - 1]

    return (
        <div
            onClick={onClick}
            className="p-4 cursor-pointer transition-colors duration-200"
            style={{
                backgroundColor: isSelected
                    ? "var(--color-primary-p-5015)"
                    : "transparent",
                borderBottomColor: "var(--color-neutrals-n-30)",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderRightColor: isSelected
                    ? "var(--color-primary-p-50)"
                    : "transparent",
                borderRightWidth: isSelected ? "4px" : "0px",
                borderRightStyle: "solid",
            }}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Online indicator */}
                    {<div
                        className={clsx("absolute bottom-0 left-0 w-3 h-3 border-2 rounded-full")}
                        style={{
                            backgroundColor: chat.state === ChatState.ACTIVE ? "var(--color-success)" : "var(--color-error)",
                            borderColor: "var(--color-neutrals-surface)",
                        }}
                    />}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3
                            className="font-semibold truncate"
                            style={{
                                color: "var(--color-neutrals-on-app-bar)",
                            }}
                        >
                            {chat.name}
                        </h3>
                        <span
                            className="text-xs whitespace-nowrap mr-2"
                            style={{ color: "var(--color-neutrals-n-200)" }}
                        >
                            {new Date(lastMessage.time).toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <p
                            className="text-sm truncate"
                            style={{ color: "var(--color-neutrals-n-300)" }}
                        >
                            {lastMessage.text}
                        </p>
                        {chat.unreadCount > 0 && (
                            <div
                                className="text-white text-xs rounded-full h-5 min-w-5 w-5 flex items-center justify-center mr-2"
                                style={{
                                    backgroundColor:
                                        "var(--color-primary-p-50)",
                                }}
                            >
                                {chat.unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatItem;
