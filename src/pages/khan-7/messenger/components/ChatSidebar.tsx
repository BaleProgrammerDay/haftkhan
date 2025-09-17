import { Chats, ChatsList } from "../types/Chat";
import ChatItem from "./ChatItem";
// import Search from "./icons/Search";
import PixelLogo from "./PixelLogo";
import { Chat } from "../types/Chat";
import { useSelector } from "react-redux";
import { userSelector } from "~/store/user/slice";

interface ChatSidebarProps {
  chats: ChatsList;
  selectedChat: Chat;
  onSelectChat: (chat: Chats) => void;
}

function ChatSidebar({ chats, selectedChat, onSelectChat }: ChatSidebarProps) {
  const user = useSelector(userSelector);
  return (
    <div
      className="w-80 flex flex-col"
      style={{
        backgroundColor: "var(--color-neutrals-surface)",
        borderLeftColor: "var(--color-neutrals-n-30)",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          borderBottomColor: "var(--color-neutrals-n-30)",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        }}
      >
        <div className="flex justify-center mb-3">
          <PixelLogo width={32} height={32} />
        </div>

        {/* Money Amount Indicator */}
        <div
          className="flex items-center gap-2 justify-center bg-[var(--color-neutrals-n-20)] rounded-lg py-2 px-4 border"
          style={{
            borderColor: "var(--color-neutrals-n-50)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <img
            src={"./assets/money.png"}
            alt="Money"
            width={24}
            height={24}
            className="mr-2"
            style={{ display: "inline-block" }}
          />
          <span
            className="text-sm font-bold"
            style={{ color: "var(--color-neutrals-on-app-bar)" }}
          >
            {user.total_score}
          </span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {Object.values(chats)
          .filter((chat) => chat.messages.length > 0)
          .sort((a, b) => {
            return (
              b.messages[b.messages.length - 1].time -
              a.messages[a.messages.length - 1].time
            );
          })
          .map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat.id === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
