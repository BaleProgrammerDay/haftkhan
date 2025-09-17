import { useEffect, useState, useRef } from "react";
import { PlusCircle, Smile } from "lucide-react";
import Send from "./icons/Send";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { initialChats } from "~/store/chat/chat.constants";
import { EventBus } from "../../game/EventBus";
import { Chats } from "../types/Chat";
import {
  addMessage,
  removeMessage,
  toggleSendingFile,
} from "~/store/chat/chat.slice";

function MessageInput() {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentChat = useSelector((state: RootState) => state.chat.current);
  const isDisabled = initialChats[currentChat].input?.disabled;
  const isSendingFileActive = true;
  const dispatch = useDispatch();

  const handleSend = () => {
    if (isDisabled) return;
    if (message.trim()) {
      EventBus.emit("new-message", message);
      setMessage("");

      if (currentChat === Chats.Noskhe) {
        dispatch(
          addMessage({
            chatId: Chats.Noskhe,
            message: {
              sender: "me",
              type: "text",
              text: message.trim(),
            },
          })
        );

        if (message.trim() === "247568") {
          dispatch(
            addMessage({
              chatId: Chats.Noskhe,
              message: {
                text: "درحال جست و جو",
                type: "text",
                sender: "other",
              },
            })
          );
          setTimeout(() => {
            dispatch(
              addMessage({
                chatId: Chats.Noskhe,
                message: {
                  text: "شماره نسخه درست است",
                  type: "text",
                  sender: "other",
                },
              })
            );
            dispatch(
              addMessage({
                chatId: Chats.Noskhe,
                message: {
                  text: `چو بشنید کاووس کآنجا چه بود  
نکرد آنچنان کینِ شاهان ستود  

فرستاد پاسخ که اکنون ز خاک  
برآید همی بوی مشک از مغاک؟  

اگر مرگ را داروئی بودی  
جهان از غم و رنج خالی شدی  

کنون نوشدارو دهیمت مگر  
که گردد جوانی ز پیری به بر؟
`,
                  type: "text",
                  sender: "other",
                },
              })
            );
          }, 5000);
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isDisabled) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    setMessage("");
  }, [currentChat]);

  const handleFile = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
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

        if (currentChat === Chats.OtaghFekr && isSendingFileActive) {
          dispatch(
            removeMessage({ chatId: currentChat, messageId: "message-3" })
          );
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
          dispatch(toggleSendingFile({ chatId: currentChat, active: false }));
        }

        // Emit the image data through EventBus
        EventBus.emit("image-selected", file);
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
        opacity: isDisabled ? 0.6 : 1,
        pointerEvents: isDisabled ? "none" : undefined,
      }}
    >
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,image/png"
        onChange={handleImageSelect}
        style={{ display: "none" }}
        disabled={isDisabled}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleSend}
          className="p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          style={{
            opacity: message.trim() && !isDisabled ? 1 : 0.5,
            cursor: message.trim() && !isDisabled ? "pointer" : "not-allowed",
          }}
          disabled={!message.trim() || isDisabled}
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
            disabled={isDisabled}
          />
          <div className="absolute left-3 bottom-3 flex items-center justify-center">
            <button
              className="rounded-full p-1 transition-colors duration-200 cursor-pointer hover:bg-gray-100"
              style={{
                color: "var(--color-neutrals-n-200)",
              }}
              disabled={isDisabled}
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
                disabled={isDisabled}
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

