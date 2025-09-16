import { useEffect, useState, useRef } from "react";
import { PlusCircle, Smile } from "lucide-react";
import Send from "./icons/Send";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { initialChats } from "~/store/chat/chat.constants";
import { EventBus } from "../../game/EventBus";
import { Chats } from "../types/Chat";
import { addMessage, toggleSendingFile } from "~/store/chat/chat.slice";

function MessageInput() {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatID = useSelector((state: RootState) => state.chat.current);
  const isSendingFileActive = useSelector(
    (state: RootState) => state.chat.list[chatID].sendFile
  );
  const dispatch = useDispatch();

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

  const handleFile = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      // Create a FileReader to read the image as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          file: file,
          dataUrl: event.target?.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        if (chatID === Chats.OtaghFekr && isSendingFileActive) {
          dispatch(
            addMessage({
              chatId: Chats.OtaghFekr,
              message: {
                sender: "me",
                type: "image",
                text: URL.createObjectURL(file),
              },
            })
          );
          dispatch(toggleSendingFile({ chatId: chatID, active: false }));
        }

        // Emit the image data through EventBus
        EventBus.emit("image-selected", imageData);
      };

      reader.readAsDataURL(file);
    }

    // Reset the input value to allow selecting the same file again
    if (e.target) {
      e.target.value = "";
    }
  };
  return (
    <div
      style={{
        backgroundColor: "var(--color-neutrals-surface)",
        borderTopColor: "var(--color-neutrals-n-30)",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
      }}
    >
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,image/png"
        onChange={handleImageSelect}
        style={{ display: "none" }}
      />

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
          <div className="absolute left-3 bottom-3 flex items-center justify-center">
            <button
              className="rounded-full p-1 transition-colors duration-200 cursor-pointer hover:bg-gray-100"
              style={{
                color: "var(--color-neutrals-n-200)",
              }}
            >
              <Smile className="w-5 h-5" />
            </button>
            {isSendingFileActive && (
              <button
                className="rounded-full p-1 transition-colors duration-200 cursor-pointer hover:bg-gray-100"
                style={{
                  color: "var(--color-neutrals-n-200)",
                }}
                onClick={handleFile}
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;

