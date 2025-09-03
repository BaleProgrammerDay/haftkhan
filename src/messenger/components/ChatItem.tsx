import React from "react";
import { Chat } from "../types/Chat";

interface ChatItemProps {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
}

function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
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
                ":hover": { backgroundColor: "var(--color-neutrals-n-20)" },
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
                    <div
                        className="absolute bottom-0 left-0 w-3 h-3 border-2 rounded-full"
                        style={{
                            backgroundColor: "var(--color-success)",
                            borderColor: "var(--color-neutrals-surface)",
                        }}
                    ></div>
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
                            {chat.time}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <p
                            className="text-sm truncate"
                            style={{ color: "var(--color-neutrals-n-300)" }}
                        >
                            {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                            <div
                                className="text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2"
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
