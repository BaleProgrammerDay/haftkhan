import { Chat } from "../types/Chat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { IRefPhaserGame } from "../../PhaserGame";

interface ChatAreaProps {
    selectedChat: Chat;
    phaserRef: React.RefObject<IRefPhaserGame | null>;
}

function ChatArea({ selectedChat, phaserRef }: ChatAreaProps) {
    return (
        <div
            className="flex-1 flex flex-col"
            style={{ backgroundColor: "var(--color-neutrals-n-20)" }}
        >
            <ChatHeader chat={selectedChat} />
            <MessageList chatId={selectedChat.id} phaserRef={phaserRef} />
            <MessageInput />
        </div>
    );
}

export default ChatArea;

