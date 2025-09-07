import { useState, useEffect, useRef } from "react";
import ChatSidebar from "../messenger/components/ChatSidebar";
import ChatArea from "../messenger/components/ChatArea";
import ThemeToggle from "../../../components/ThemeToggle";
import { Chat } from "../messenger/types/Chat";
import { IRefPhaserGame } from "../PhaserGame";

// Patrick chat data
const patricChat: Chat = {
    id: "TeamPlayer",
    name: "پاتریک لنچونی",
    lastMessage: "سلام",
    time: "14:30",
    avatar: "/assets/patrick_avatar.png",
    unreadCount: 0,
};

function PatricPage() {
    // References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [selectedChat, setSelectedChat] = useState<Chat>(patricChat);

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        setTimeout(() => {
            //@ts-ignore
            phaserRef.current?.scene?.changeScene(chat.id);
        }, 100);
    };

    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{
                backgroundColor: "var(--color-neutrals-n-20)",
            }}
            dir="rtl"
        >
            <div
                className="w-full max-w-[1400px] h-full overflow-hidden flex"
                style={{
                    backgroundColor: "var(--color-neutrals-surface)",
                }}
            >
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Chat Sidebar - Right side in RTL */}
                <ChatSidebar
                    chats={[patricChat]}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                />

                {/* Chat Area - Left side in RTL */}
                <ChatArea selectedChat={selectedChat} phaserRef={phaserRef} />
            </div>
        </div>
    );
}

export default PatricPage;

