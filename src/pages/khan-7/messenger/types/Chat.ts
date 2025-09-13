export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: number;
}

export enum Chats {
	TeamPlayer = "TeamPlayer",
	RakhshChat = "RakhshChat",
	Barghman = "Barghman",
	Tajamolian = "Tajamolian",
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
	avatar: string;
	unreadCount: number;
	state: ChatState;
	messages: Message[];
}

export type ChatsList = {
    [key: string]: Chat;
}