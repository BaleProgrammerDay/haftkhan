import React from 'react';
import { Chat } from '../types/Chat';

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
        isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Online indicator */}
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
            <span className="text-xs text-gray-500 whitespace-nowrap mr-2">{chat.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            {chat.unreadCount > 0 && (
              <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;