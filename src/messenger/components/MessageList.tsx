import { useRef, useState } from "react";
import { Message } from "../types/Chat";
import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";

interface MessageListProps {
    chatId: string;
}

// Sample messages for demonstration
const initialMessages: Record<string, Message[]> = {
    "1": [
        { id: "1", text: "سلام", sender: "other", time: "14:20" },
        { id: "2", text: "سلام", sender: "me", time: "14:21" },
        {
            id: "3",
            text: "سه ویژگی بازیکن تیمی ایده آل رو داری؟",
            sender: "other",
            time: "14:22",
        },
    ],
};

function MessageList({ chatId }: MessageListProps) {
    const [messages, setMessages] = useState<Message[]>(
        initialMessages[chatId] || []
    );

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        // Scene change handler - can be used for future functionality
        console.log("Current scene:", scene.scene.key);
    };
    const handleDelete = (id: string) => {
        setMessages((msgs) => msgs.filter((msg) => msg.id !== id));
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

