import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

function MessageInput() {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            // Here you would handle sending the message
            console.log("Sending message:", message);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className="p-4"
            style={{
                backgroundColor: "var(--color-neutrals-surface)",
                borderTopColor: "var(--color-neutrals-n-30)",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
            }}
        >
            <div className="flex items-end gap-2">
                <button
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: "var(--color-neutrals-n-200)",
                        ":hover": {
                            backgroundColor: "var(--color-neutrals-n-20)",
                        },
                    }}
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="پیام بنویسید..."
                        className="w-full p-3 pr-12 rounded-2xl resize-none focus:outline-none max-h-32 min-h-[44px]"
                        style={{
                            backgroundColor: "var(--color-neutrals-n-20)",
                            borderColor: "var(--color-neutrals-n-40)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            color: "var(--color-neutrals-on-app-bar)",
                            focusRingColor: "var(--color-primary-p-50)",
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

                <button
                    onClick={handleSend}
                    className="p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: message.trim()
                            ? "var(--color-primary-p-50)"
                            : "var(--color-neutrals-n-40)",
                        color: message.trim()
                            ? "var(--color-neutrals-on-primary)"
                            : "var(--color-neutrals-n-200)",
                        cursor: message.trim() ? "pointer" : "not-allowed",
                    }}
                    disabled={!message.trim()}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
