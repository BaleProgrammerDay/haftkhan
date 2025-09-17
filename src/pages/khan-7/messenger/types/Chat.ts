export interface Message {
  id: string;
  type: "text" | "image";
  text: string;
  sender: "me" | "other" | string;
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
  Parking = "Parking",
  OtaghFekr = "OtaghFekr",
}

export enum ChatState {
  IDLE = "کمی پیش آنلاین بوده است",
  ACTIVE = "آنلاین",
  OFFLINE = "آفلاین",
  TYPING = "در حال تایپ ...",
  NONE = "",
}

export interface Chat {
  id: Chats;
  name: string;
  avatar: string;
  unreadCount: number;
  state: ChatState;
  messages: Message[];
  sendFile?: boolean;
  disablePointerEvents?: boolean;
  input?: {
    placeholder?: string;
    maxLength?: number;
    disabled?: boolean;
  };
}

export type ChatsList = {
  [key: string]: Chat;
};
