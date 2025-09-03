import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Chat } from '../types/Chat';

interface ChatHeaderProps {
  chat: Chat;
}

function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-900">{chat.name}</h2>
          <p className="text-sm text-green-600">آنلاین</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;