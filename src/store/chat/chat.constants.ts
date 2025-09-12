import { Chat, Chats, ChatState } from "~/pages/khan-7/messenger/types/Chat";
import barghMan from "../../assets/bargh_man.png";

export const initialChats: {[key: Chats | string]: Chat} =  {
	[Chats.TeamPlayer]: {
	id: Chats.TeamPlayer,
	name: "پاتریک لنچونی",
	lastMessage: "سلام",
	time: "14:30",
	avatar: "/assets/patrick_avatar.png",
	unreadCount: 0,
	state: ChatState.ACTIVE,
	messages: [
		{ id: "1", text: "سلام", sender: "other", time: "14:20" },
		{ id: "2", text: "سلام", sender: "me", time: "14:21" },
		{
			id: "3",
			text: "سه ویژگی بازیکن تیمی ایده آل رو داری؟",
			sender: "other",
			time: "14:22",
		},
	]
  },
  [Chats.RakhshChat]:{
	id: Chats.RakhshChat,
	name: "رخش",
	lastMessage: "سلام",
	time: "9:20",
	avatar: "/assets/rakhsh_avatar.jpg",
	unreadCount: 1,
	state: ChatState.ACTIVE,
	messages: [{ id: "1", text: "سلام", sender: "other", time: "9:19" }]
  },
  [Chats.Barghman]:{
	id: Chats.Barghman,
	name: "برق من",
	lastMessage: "لطفا قبل از ترک شرکت برق را خاموش  کنید",
	time: "19:59",
	avatar: barghMan,
	unreadCount: 0,
	state: ChatState.ACTIVE,
	messages: [
		{
			id: "1",
			text: "لطفا قبل رفتن برق رو خاموش  کنید",
			sender: "other",
			time: "19:58",
		}
	]
  },
}