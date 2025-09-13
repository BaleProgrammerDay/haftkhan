import { Chat, Chats, ChatState } from "~/pages/khan-7/messenger/types/Chat";
import barghMan from "../../assets/bargh_man.png";
import tajammolian from "../../assets/tajammolian.png";

export const initialChats: {[key: Chats | string]: Chat} =  {
	[Chats.TeamPlayer]: {
	id: Chats.TeamPlayer,
	name: "پاتریک لنچونی",
	avatar: "/assets/patrick_avatar.png",
	unreadCount: 0,
	state: ChatState.ACTIVE,
	messages: [
		{ id: "1", text: "سلام", sender: "other", time: new Date(1755057140).getTime() },
		{ id: "2", text: "سلام", sender: "me", time: new Date(1755057140).getTime() },
		{
			id: "3",
			text: "سه ویژگی بازیکن تیمی ایده آل رو داری؟",
			sender: "other",
			time: new Date(1755057140).getTime(),
		},
	]
  },
  [Chats.RakhshChat]:{
	id: Chats.RakhshChat,
	name: "رخش",
	avatar: "/assets/rakhsh_avatar.jpg",
	unreadCount: 1,
	state: ChatState.ACTIVE,
	messages: [{ id: "1", text: "سلام", sender: "other", time: new Date(12871310400).getTime() }]
  },
  [Chats.Barghman]:{
	id: Chats.Barghman,
	name: "برق من",
	avatar: barghMan,
	unreadCount: 0,
	state: ChatState.ACTIVE,
	messages: [
		{
			id: "1",
			text: "لطفا قبل رفتن برق رو خاموش  کنید",
			sender: "other",
			time: new Date().getTime(),
		}
	]
  },
  [Chats.Tajamolian]:{
	id: Chats.Tajamolian,
	name: "امین تجملیان",
	avatar: tajammolian,
	unreadCount: 0,
	state: ChatState.ACTIVE,
	messages: [
	]
  },
}