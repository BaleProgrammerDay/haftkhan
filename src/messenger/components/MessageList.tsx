import { useRef } from "react";
import { Message } from "../types/Chat";
import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";

interface MessageListProps {
    chatId: string;
}

// Sample messages for demonstration
const sampleMessages: Record<string, Message[]> = {
    "1": [{ id: "1", text: "سلام چطوری؟", sender: "other", time: "14:20" }],
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

