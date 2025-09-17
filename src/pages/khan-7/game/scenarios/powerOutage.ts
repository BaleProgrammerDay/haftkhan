import { API } from "~/api/api";
import { Chats, ChatState } from "../../messenger/types/Chat";
import { addMessage, changeChatState } from "~/store/chat/chat.slice";
import { togglePower } from "~/store/general/general.slice";
import { store } from "~/store/store";
import { hashStringToNumber } from "../utils";
import { userActions } from "~/store/user/slice";

export const powerOutage = () => {
  store.dispatch(togglePower(false));
  store.dispatch(
    changeChatState({ chatId: Chats.Barghman, newState: ChatState.TYPING })
  );
  setTimeout(() => {
    store.dispatch(
      addMessage({
        chatId: Chats.Tajamolian,
        message: {
          sender: "other",
          text: "10 بار گفتم برقارو خاموش کنید",
          type: "text",
        },
      })
    );

    setTimeout(() => {
      store.dispatch(
        addMessage({
          chatId: Chats.Tajamolian,
          message: {
            sender: "other",
            text: "الان خوشحالی رفت ؟",
            type: "text",
          },
        })
      );
      store.dispatch(
        changeChatState({
          chatId: Chats.Tajamolian,
          newState: ChatState.OFFLINE,
        })
      );
    }, 2000);
  }, 1000);
};

export const powerRestore = (id: string) => {
  store.dispatch(userActions.addToScore());
  API.submitAnswer({
    question_id: hashStringToNumber(id),
    answer: hashStringToNumber(id.split("").reverse().join("")).toString(),
  }).then(() => {});
  store.dispatch(togglePower(true));
  setTimeout(() => {
    store.dispatch(
      changeChatState({ chatId: Chats.Tajamolian, newState: ChatState.TYPING })
    );
    setTimeout(() => {
      store.dispatch(
        addMessage({
          chatId: Chats.Tajamolian,
          message: {
            sender: "other",
            text: "ممنون رستم جان! لطفا از دفعات بعد بدون نیاز به برق کار کنید :)",
            type: "text",
          },
        })
      );
      store.dispatch(
        changeChatState({
          chatId: Chats.Tajamolian,
          newState: ChatState.ACTIVE,
        })
      );
      store.dispatch(
        changeChatState({ chatId: Chats.Barghman, newState: ChatState.TYPING })
      );
      setTimeout(() => {
        store.dispatch(
          addMessage({
            chatId: Chats.Barghman,
            message: {
              sender: "other",
              text: "مشترک محترم، مصرف برق شما به الگوی مصرف منصفانه رسیده است، 50 امتیاز بابت همکاری شما به شما تعلق گرفت",
              type: "text",
            },
          })
        );
        store.dispatch(
          changeChatState({
            chatId: Chats.Barghman,
            newState: ChatState.ACTIVE,
          })
        );
      }, 2000);
    }, 2000);
  }, 1000);
};
