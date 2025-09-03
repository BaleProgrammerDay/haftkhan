import React from 'react';
import { Search } from 'lucide-react';
import { Chat } from '../types/Chat';
import ChatItem from './ChatItem';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat;
  onSelectChat: (chat: Chat) => void;
}

function ChatSidebar({ chats, selectedChat, onSelectChat }: ChatSidebarProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-3">پیام‌ها</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="جستجو در گفتگوها..."
            className="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat.id === chat.id}
            onClick={() => onSelectChat(chat)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;