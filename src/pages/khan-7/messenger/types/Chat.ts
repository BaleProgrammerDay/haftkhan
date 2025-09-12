export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export enum Chats {
	TeamPlayer = "TeamPlayer",
	RakhshChat = "RakhshChat",
	Barghman = "Barghman"
}

export enum ChatState {
	IDLE = "کمی پیش آنلاین بوده است",
	ACTIVE = "آنلاین",
	OFFLINE = "آفلاین",
	TYPING = "در حال تایپ ..."
}

export interface Chat {
	id: Chats;
	name: string;
	lastMessage: string;
	time: string;
	avatar: string;
	unreadCount: number;
	state: ChatState;
	messages: Message[];
}

export type ChatsList = {
    [key: string]: Chat;
}