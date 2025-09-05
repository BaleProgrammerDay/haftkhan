import { Phone, Video, MoreVertical } from "lucide-react";
import { Chat } from "../types/Chat";

interface ChatHeaderProps {
    chat: Chat;
}

function ChatHeader({ chat }: ChatHeaderProps) {
    return (
        <div
            className="p-4 flex items-center justify-between"
            style={{
                backgroundColor: "var(--color-neutrals-surface)",
                borderBottomColor: "var(--color-neutrals-n-30)",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
            }}
        >
            <div className="flex items-center gap-3">
                <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h2
                        className="font-semibold"
                        style={{ color: "var(--color-neutrals-on-app-bar)" }}
                    >
                        {chat.name}
                    </h2>
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-success)" }}
                    >
                        آنلاین
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* <button
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: "var(--color-neutrals-n-200)",
                        ":hover": {
                            backgroundColor: "var(--color-neutrals-n-20)",
                        },
                    }}
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: "var(--color-neutrals-n-200)",
                        ":hover": {
                            backgroundColor: "var(--color-neutrals-n-20)",
                        },
                    }}
                >
                    <Video className="w-5 h-5" />
                </button> */}
                <button
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                        color: "var(--color-neutrals-n-200)",
                        ":hover": {
                            backgroundColor: "var(--color-neutrals-n-20)",
                        },
                    }}
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;

