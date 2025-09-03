import React from 'react';
import { Chat } from '../types/Chat';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  selectedChat: Chat;
}

function ChatArea({ selectedChat }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader chat={selectedChat} />
      <MessageList chatId={selectedChat.id} />
      <MessageInput />
    </div>
  );
}

export default ChatArea;