import { Chats, ChatsList } from "../types/Chat";
import ChatItem from "./ChatItem";
import Search from "./icons/Search";
import PixelLogo from "./PixelLogo";
import { Chat } from "../types/Chat";

interface ChatSidebarProps {
    chats: ChatsList;
    selectedChat: Chat;
    onSelectChat: (chat: Chats) => void;
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
                    <PixelLogo width={32} height={32} />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search
                        width={24}
                        height={24}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    />
                    <input
                        type="text"
                        placeholder="جستجو در گفتگوها..."
                        className="w-full pr-10 pl-4 py-2 rounded-lg border-none focus:outline-none text-sm"
                        style={{
                            backgroundColor: "var(--color-neutrals-n-20)",
                            color: "var(--color-neutrals-on-app-bar)",
                        }}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {Object.values(chats).sort((a, b) => {
                    return Number(b.time.split(":")[0]) - Number(a.time.split(":")[0]) + Number(b.time.split(":")[1]) - Number(a.time.split(":")[1]);
                }).map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChat.id === chat.id}
                        onClick={() => onSelectChat(chat.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ChatSidebar;

