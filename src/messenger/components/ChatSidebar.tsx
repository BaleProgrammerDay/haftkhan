import { Search } from "lucide-react";
import { Chat } from "../types/Chat";
import ChatItem from "./ChatItem";
import Logo from "./Logo";

interface ChatSidebarProps {
    chats: Chat[];
    selectedChat: Chat;
    onSelectChat: (chat: Chat) => void;
}

function ChatSidebar({ chats, selectedChat, onSelectChat }: ChatSidebarProps) {
    return (
        <div
            className="w-80 flex flex-col"
            style={{
                backgroundColor: "var(--color-neutrals-surface)",
                borderLeftColor: "var(--color-neutrals-n-30)",
                borderLeftWidth: "1px",
                borderLeftStyle: "solid",
            }}
        >
            {/* Header */}
            <div
                className="p-4"
                style={{
                    borderBottomColor: "var(--color-neutrals-n-30)",
                    borderBottomWidth: "1px",
                    borderBottomStyle: "solid",
                }}
            >
                <div className="flex justify-center mb-3">
                    <Logo width={32} height={32} />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-neutrals-n-200)" }}
                    />
                    <input
                        type="text"
                        placeholder="جستجو در گفتگوها..."
                        className="w-full pr-10 pl-4 py-2 rounded-lg border-none focus:outline-none text-sm"
                        style={{
                            backgroundColor: "var(--color-neutrals-n-20)",
                            color: "var(--color-neutrals-on-app-bar)",
                            focusRingColor: "var(--color-primary-p-50)",
                        }}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChat.id === chat.id}
                        onClick={() => onSelectChat(chat)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ChatSidebar;

