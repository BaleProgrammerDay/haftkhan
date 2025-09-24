import MessageBubble from "./MessageBubble";
import { IRefPhaserGame, PhaserGame } from "../../PhaserGame";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { deleteMessage } from "~/store/chat/chat.slice";
import { Chats } from "../types/Chat";
import ImageMessageBubble from "./ImageMessageBubble";
import AudioMessageBubble from "./AudioMessageBubble";
import { initialChats } from "~/store/chat/chat.constants";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
// EventBus handled inside chaos module
import { useChaosContainer } from "../chaos/audioChaos";
import ChaosItem from "../chaos/ChaosItem";

interface MessageListProps {
  chatId: string;
  phaserRef: React.RefObject<IRefPhaserGame | null>;
}

function MessageList({ chatId, phaserRef }: MessageListProps) {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.chat.list[chatId as Chats].messages || []
  );
  const currentChat = useSelector((state: RootState) => state.chat.current);

  const chaosContainer = useChaosContainer();

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    // Scene change handler - can be used for future functionality
    console.log("Current scene:", scene.scene.key);
  };
  const handleDelete = (id: string) => {
    dispatch(deleteMessage({ chatId: chatId as Chats, messageId: id }));
  };

  const backgroundStyle =
    chatId === Chats.Bruce
      ? {
          backgroundImage: 'url("/assets/backgrounds/night.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          backgroundColor: "var(--background-chat)",
        };

  return (
    <div
      className="flex-1 relative"
      id="message-list-container"
      style={backgroundStyle}
    >
      <div
        className={clsx("absolute inset-0", {
          [" z-999"]: currentChat === Chats.OtaghFekr,
        })}
      >
        <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      </div>
      <div
        className={
          "relative z-10 p-4 overflow-y-auto space-y-3 " +
          (initialChats[chatId].disablePointerEvents
            ? " pointer-events-none"
            : "")
        }
        style={{ overflow: "visible", ...chaosContainer.style }}
      >
        {messages.map((message) => {
          switch (message.type) {
            case "text":
              return (
                <ChaosItem id={message.id} key={message.id}>
                  <MessageBubble
                    message={message}
                    id={"message-" + message.id}
                    onDelete={handleDelete}
                  />
                </ChaosItem>
              );
            case "image":
              return (
                <ChaosItem id={message.id} key={message.id}>
                  <ImageMessageBubble
                    message={message}
                    id={"message-" + message.id}
                    onDelete={handleDelete}
                  />
                </ChaosItem>
              );
            case "audio":
              return (
                <ChaosItem id={message.id} key={message.id}>
                  <AudioMessageBubble
                    message={message}
                    id={"message-" + message.id}
                    onDelete={handleDelete}
                  />
                </ChaosItem>
              );
          }
        })}
      </div>
    </div>
  );
}

export default MessageList;

