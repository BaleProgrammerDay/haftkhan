import { Chat, Chats, ChatState } from "~/pages/khan-7/messenger/types/Chat";
import barghMan from "../../assets/bargh_man.png";
import tajammolian from "../../assets/tajammolian.png";

export const initialChats: { [key: Chats | string]: Chat } = {
  [Chats.TeamPlayer]: {
    id: Chats.TeamPlayer,
    name: "پاتریک لنچونی",
    avatar: "/assets/avatars/patrick.png",
    unreadCount: 0,
    state: ChatState.ACTIVE,
    messages: [
      {
        id: "1",
        text: "سلام",
        sender: "other",
        time: new Date(1755057140).getTime(),
      },
      {
        id: "2",
        text: "سلام",
        sender: "me",
        time: new Date(1755057140).getTime(),
      },
      {
        id: "3",
        text: "سه ویژگی بازیکن تیمی ایده آل رو داری؟",
        sender: "other",
        time: new Date(1755057140).getTime(),
        deletable: true,
      },
    ],
  },
  [Chats.RakhshChat]: {
    id: Chats.RakhshChat,
    name: "رخش",
    avatar: "/assets/avatars/rakhsh.jpg",
    unreadCount: 1,
    state: ChatState.ACTIVE,
    messages: [
      {
        id: "1",
        text: "سلام",
        sender: "other",
        time: new Date(12871310400).getTime(),
      },
    ],
  },
  [Chats.Barghman]: {
    id: Chats.Barghman,
    name: "برق من",
    avatar: "/assets/avatars/bargheman.png",
    unreadCount: 0,
    state: ChatState.ACTIVE,
    messages: [
      {
        id: "1",
        text: "لطفا قبل رفتن برق رو خاموش  کنید",
        sender: "other",
        time: new Date().getTime(),
      },
    ],
  },
  [Chats.Tajamolian]: {
    id: Chats.Tajamolian,
    name: "امین تجملیان",
    avatar: "/assets/avatars/amin.png",
    unreadCount: 0,
    state: ChatState.ACTIVE,
    messages: [],
  },
  [Chats.Pisano]: {
    id: Chats.Pisano,
    name: "Bonanno Pisano",
    avatar: "/assets/avatars/pisano.jpg",
    unreadCount: 1,
    state: ChatState.ACTIVE,
    messages: [
      {
        id: "1",
        text: "Ciao amico!",
        sender: "other",
        time: new Date().getTime(),
        ltr: true,
      },
      {
        id: "2",
        text: "La mia torre è storta...",
        sender: "other",
        time: new Date().getTime(),
        ltr: true,
      },
      {
        id: "3",
        text: "Puoi aiutarmi a raddrizzarla?",
        sender: "other",
        time: new Date().getTime(),
        ltr: true,
      },
    ],
    input: {
      placeholder: "پیام خود را بنویسید... (فقط یک کاراکتر)",
      maxLength: 1,
    },
  },
};
