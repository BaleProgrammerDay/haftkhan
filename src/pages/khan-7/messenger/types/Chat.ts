export interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: number;
  ltr?: boolean;
  deletable?: boolean;
}

export enum Chats {
  TeamPlayer = "TeamPlayer",
  RakhshChat = "RakhshChat",
  Barghman = "Barghman",
  Tajamolian = "Tajamolian",
  Pisano = "Pisano",
  Bruce = "Bruce",
}

export enum ChatState {
  IDLE = "کمی پیش آنلاین بوده است",
  ACTIVE = "آنلاین",
  OFFLINE = "آفلاین",
  TYPING = "در حال تایپ ...",
}

export interface Chat {
  id: Chats;
  name: string;
  avatar: string;
  unreadCount: number;
  state: ChatState;
  messages: Message[];
  input?: {
    placeholder?: string;
    maxLength?: number;
    disabled?: boolean;
  };
}

export type ChatsList = {
  [key: string]: Chat;
};
