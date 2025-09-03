import { useRef } from "react";
import { Message } from "../types/Chat";
import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";

interface MessageListProps {
    chatId: string;
}

// Sample messages for demonstration
const sampleMessages: Record<string, Message[]> = {
    "1": [
        { id: "1", text: "سلام علی! چطوری؟", sender: "other", time: "14:20" },
        {
            id: "2",
            text: "سلام، ممنون. خوبم، تو چطوری؟",
            sender: "me",
            time: "14:22",
        },
        {
            id: "3",
            text: "منم خوبم، مرسی. کارت چطوره؟",
            sender: "other",
            time: "14:25",
        },
        {
            id: "4",
            text: "کارم خوب پیش میره. پروژه جدید شروع کردم",
            sender: "me",
            time: "14:28",
        },
        { id: "5", text: "عالیه! موفق باشی", sender: "other", time: "14:30" },
    ],
    "2": [
        {
            id: "1",
            text: "سلام مریم، جلسه فردا ساعت چنده؟",
            sender: "me",
            time: "12:10",
        },
        {
            id: "2",
            text: "سلام، ساعت ۱۰ صبح. فراموش نکن!",
            sender: "other",
            time: "12:15",
        },
    ],
};

function MessageList({ chatId }: MessageListProps) {
    const messages = sampleMessages[chatId] || [];

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        // Scene change handler - can be used for future functionality
        console.log("Current scene:", scene.scene.key);
    };
    return (
        <div
            className="flex-1 relative"
            id="message-list-container"
            style={{ backgroundColor: "var(--background-chat)" }}
        >
            <div className="absolute inset-0 pointer-events-none z-0">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>
            <div className="relative z-10 p-4 overflow-y-auto space-y-3">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>
        </div>
    );
}

export default MessageList;

