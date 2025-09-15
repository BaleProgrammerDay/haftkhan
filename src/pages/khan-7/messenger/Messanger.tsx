import { useState, useEffect, useRef } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatArea from "./components/ChatArea";
import ThemeToggle from "../../../components/ThemeToggle";
import { IRefPhaserGame } from "../PhaserGame";
import { Chats } from "./types/Chat";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import PowerControl from "./components/PowerControl";
import { setCurrentChat } from "~/store/chat/chat.slice";
import { powerOutage } from "../game/scenarios/powerOutage";

function Messanger() {
  // References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.list);
  const selectedChatIndex = useSelector(
    (state: RootState) => state.chat.current
  );
  const selectedChat = useSelector(
    (state: RootState) => state.chat.list[selectedChatIndex]
  );

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleSelectChat = (id: Chats) => {
    console.log("!@!", id);
    dispatch(setCurrentChat(id));
    setTimeout(() => {
      //@ts-ignore
      phaserRef.current?.scene?.changeScene(id);
    }, 100);
  };

  return (
    <div
      className="h-screen flex items-center justify-center relative"
      style={{
        backgroundColor: "var(--color-neutrals-n-20)",
      }}
      dir="rtl"
    >
      <div
        className="w-full max-w-[1400px] h-full overflow-hidden flex"
        style={{
          backgroundColor: "var(--color-neutrals-surface)",
          fontFamily: "sorena",
        }}
      >
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Chat Sidebar - Right side in RTL */}
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
        />

        {/* Chat Area - Left side in RTL */}
        <ChatArea selectedChat={selectedChat} phaserRef={phaserRef} />
      </div>

      <PowerControl />
    </div>
  );
}

export default Messanger;
