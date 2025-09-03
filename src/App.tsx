import { useState, useEffect } from "react";
import ChatSidebar from "./messenger/components/ChatSidebar";
import ChatArea from "./messenger/components/ChatArea";
import ThemeToggle from "./components/ThemeToggle";
import { Chat } from "./messenger/types/Chat";

// Sample Persian chat data
const sampleChats: Chat[] = [
    {
        id: "1",
        name: "علی احمدی",
        lastMessage: "سلام، چطوری؟",
        time: "14:30",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        unreadCount: 2,
    },
    {
        id: "2",
        name: "مریم کریمی",
        lastMessage: "فردا جلسه داریم",
        time: "12:15",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        unreadCount: 0,
    },
    {
        id: "3",
        name: "رضا محمدی",
        lastMessage: "ممنون از کمکت",
        time: "دیروز",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        unreadCount: 0,
    },
    {
        id: "4",
        name: "فاطمه نوری",
        lastMessage: "فایل رو فرستادم",
        time: "دیروز",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        unreadCount: 1,
    },
];

function App() {
    const [selectedChat, setSelectedChat] = useState<Chat>(sampleChats[0]);

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "light";
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
