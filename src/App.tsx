// import { useRef, useState } from "react";
// import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
// import { MainMenu } from "./game/scenes/MainMenu";

// function App() {
//     // The sprite can only be moved in the MainMenu Scene
//     const [canMoveSprite, setCanMoveSprite] = useState(true);

//     //  References to the PhaserGame component (game and scene are exposed)
//     const phaserRef = useRef<IRefPhaserGame | null>(null);
//     const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

//     const changeScene = () => {
//         if (phaserRef.current) {
//             const scene = phaserRef.current.scene as MainMenu;

//             if (scene) {
//                 scene.changeScene();
//             }
//         }
//     };

//     const moveSprite = () => {
//         if (phaserRef.current) {
//             const scene = phaserRef.current.scene as MainMenu;

//             if (scene && scene.scene.key === "MainMenu") {
//                 // Get the update logo position
//                 scene.moveLogo(({ x, y }) => {
//                     setSpritePosition({ x, y });
//                 });
//             }
//         }
//     };

//     const addSprite = () => {
//         if (phaserRef.current) {
//             const scene = phaserRef.current.scene;

//             if (scene) {
//                 // Add more stars
//                 const x = Phaser.Math.Between(64, scene.scale.width - 64);
//                 const y = Phaser.Math.Between(64, scene.scale.height - 64);

//                 //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
//                 const star = scene.add.sprite(x, y, "star");

//                 //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
//                 //  You could, of course, do this from within the Phaser Scene code, but this is just an example
//                 //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
//                 scene.add.tween({
//                     targets: star,
//                     duration: 500 + Math.random() * 1000,
//                     alpha: 0,
//                     yoyo: true,
//                     repeat: -1,
//                 });
//             }
//         }
//     };

//     // Event emitted from the PhaserGame component
//     const currentScene = (scene: Phaser.Scene) => {
//         setCanMoveSprite(scene.scene.key !== "MainMenu");
//     };

//     return (
//         <div id="app">
//             <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
//             {/* <div>
//                 <div>
//                     <button className="button" onClick={changeScene}>Change Scene</button>
//                 </div>
//                 <div>
//                     <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
//                 </div>
//                 <div className="spritePosition">Sprite Position:
//                     <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
//                 </div>
//                 <div>
//                     <button className="button" onClick={addSprite}>Add New Sprite</button>
//                 </div>
//             </div> */}
//         </div>
//     );
// }

// export default App;

import React, { useState } from "react";
import ChatSidebar from "./messenger/components/ChatSidebar";
import ChatArea from "./messenger/components/ChatArea";
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

    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            dir="rtl"
        >
            <div className="w-full max-w-[1400px] h-[800px] bg-white rounded-lg shadow-lg overflow-hidden flex">
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
