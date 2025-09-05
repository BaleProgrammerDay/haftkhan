import { useState, useEffect } from "react";
import ChatSidebar from "./messenger/components/ChatSidebar";
import ChatArea from "./messenger/components/ChatArea";
import ThemeToggle from "./components/ThemeToggle";
import { Chat } from "./messenger/types/Chat";

// Sample Persian chat data
const sampleChats: Chat[] = [
    {
        id: "1",
        name: "پاتریک لنچونی",
        lastMessage: "سلام",
        time: "14:30",
        avatar: "/assets/avatar.jpg",
        unreadCount: 0,
    },
];

function App() {
    const [selectedChat, setSelectedChat] = useState<Chat>(sampleChats[0]);

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

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
                    chats={sampleChats}
                    selectedChat={selectedChat}
                    onSelectChat={setSelectedChat}
                />

                {/* Chat Area - Left side in RTL */}
                <ChatArea selectedChat={selectedChat} />
            </div>
        </div>
    );
}

export default App;
