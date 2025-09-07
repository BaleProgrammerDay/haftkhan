export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}