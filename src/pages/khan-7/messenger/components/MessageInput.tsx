import { useEffect, useState } from "react";
import { Smile } from "lucide-react";
import Send from "./icons/Send";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { initialChats } from "~/store/chat/chat.constants";
import { EventBus } from "../../game/EventBus";

function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      EventBus.emit("new-message", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentChat = useSelector((state: RootState) => state.chat.current);
  useEffect(() => {
    setMessage("");
  }, [currentChat]);

  return (
    <div
      style={{
        backgroundColor: "var(--color-neutrals-surface)",
        borderTopColor: "var(--color-neutrals-n-30)",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
      }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={handleSend}
          className="p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          style={{
            opacity: message.trim() ? 1 : 0.5,
            cursor: message.trim() ? "pointer" : "not-allowed",
          }}
          disabled={!message.trim()}
        >
          <Send width={32} height={32} />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              initialChats[currentChat].input?.placeholder ??
              "پیام خود را بنویسید..."
            }
            maxLength={initialChats[currentChat].input?.maxLength}
            className="w-full p-3 resize-none focus:outline-none max-h-32 min-h-[44px]"
            style={{
              color: "var(--color-neutrals-on-app-bar)",
            }}
            rows={1}
          />
          <button
            className="absolute left-3 bottom-3 rounded-full p-1 transition-colors duration-200"
            style={{
              color: "var(--color-neutrals-n-200)",
              ":hover": {
                backgroundColor: "var(--color-neutrals-n-20)",
              },
            }}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
