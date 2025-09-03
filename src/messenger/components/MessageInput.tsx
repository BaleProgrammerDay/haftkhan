import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

function MessageInput() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Here you would handle sending the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="پیام بنویسید..."
            className="w-full p-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[44px]"
            rows={1}
          />
          <button className="absolute left-3 bottom-3 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button
          onClick={handleSend}
          className={`p-3 rounded-full transition-all duration-200 ${
            message.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;