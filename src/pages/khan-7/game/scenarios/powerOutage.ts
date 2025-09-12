import { Chats, ChatState } from "../../messenger/types/Chat";
import { addMessage, changeChatState } from "~/store/chat/chat.slice"
import { togglePower } from "~/store/general/general.slice";
import { store } from "~/store/store"

export const powerOutage = () => {
	store.dispatch(togglePower(false))
	store.dispatch(changeChatState({chatId: Chats.Barghman, newState: ChatState.TYPING}))
	setTimeout(() => {
		store.dispatch(addMessage({chatId: Chats.Barghman, message: {
			sender: "other",
			text: "10 بار گفتم برقارو خاموش کنید",
			time: new Date().toLocaleTimeString(),
		}}))
	
		setTimeout(() => {
			store.dispatch(addMessage({chatId: Chats.Barghman, message: {
				sender: "other",
				text: "الان خوشحالی رفت ؟",
				time: new Date().toLocaleTimeString(),
			}}))
			store.dispatch(changeChatState({chatId: Chats.Barghman, newState: ChatState.OFFLINE}))
		}, 2000);
	}, 1000);
}