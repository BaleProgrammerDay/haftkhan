import { useEffect, useRef, useState } from "react";
import { Message } from "../types/Chat";
import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";

interface MessageListProps {
    chatId: string;
    phaserRef: React.RefObject<IRefPhaserGame | null>;
}

// Sample messages for demonstration
const initialMessages: Record<string, Message[]> = {
    TeamPlayer: [
        { id: "1", text: "سلام", sender: "other", time: "14:20" },
        { id: "2", text: "سلام", sender: "me", time: "14:21" },
        {
            id: "3",
            text: "سه ویژگی بازیکن تیمی ایده آل رو داری؟",
            sender: "other",
            time: "14:22",
        },
    ],
    RakhshChat: [{ id: "1", text: "سلام", sender: "other", time: "9:19" }],
};

function MessageList({ chatId, phaserRef }: MessageListProps) {
    const [messages, setMessages] = useState<Message[]>(
        initialMessages[chatId] || []
    );

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        // Scene change handler - can be used for future functionality
        console.log("Current scene:", scene.scene.key);
    };
    const handleDelete = (id: string) => {
        setMessages((msgs) => msgs.filter((msg) => msg.id !== id));
    };

    useEffect(() => {
        window.addEventListener("allDoorsActivated", () => {
            setMessages((msgs) => [
                ...msgs,
                {
                    id: Date.now().toString(),
                    text: "تو استخدامی!",
                    sender: "other",
                    time: new Date().toLocaleTimeString(),
                },
            ]);
        });
    }, []);

    useEffect(() => {
        setMessages(initialMessages[chatId]);
    }, [chatId]);

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
                    <MessageBubble
                        key={message.id}
                        message={message}
                        id={"message-" + message.id}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default MessageList;

