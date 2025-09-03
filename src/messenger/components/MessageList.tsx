import React, { useRef, useState } from "react";
import { Message } from "../types/Chat";
import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import { MainMenu } from "../../game/scenes/MainMenu";

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
    //  The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene) {
                scene.changeScene();
            }
        }
    };

    const moveSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === "MainMenu") {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {
                    setSpritePosition({ x, y });
                });
            }
        }
    };

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, "star");

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1,
                });
            }
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };
    return (
        <div className="flex-1 relative" id="message-list-container">
            <div className="absolute inset-0 pointer-events-none z-0">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>
            <div className="relative z-10 p-4  overflow-y-auto space-y-3">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>
        </div>
    );
}

export default MessageList;

