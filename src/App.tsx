import { useEffect, useLayoutEffect } from "react";
import { Khan1 } from "./pages/khan-1/Khan1";

import { Khan2 } from "./pages/khan-2/Khan2";
import styles from "./App.module.scss";
import { useNotification } from "./context/Notification";
import { Khan3 } from "./pages/khan-3/Khan3";
import Messanger from "./pages/khan-7/messenger";
import { useDispatch, useSelector } from "react-redux";
import { Khan4 } from "./pages/khan-4/Khan4";
import { getTextDirection } from "./utils";
import { Khan5 } from "./pages/khan-5/Khan5";
import { Khan6 } from "./pages/khan-6/Khan6";
import { API } from "./api/api";
import {
  lastSolvedQuestionSelector,
  userActions,
  isLoadingSelector,
} from "./store/user/slice";
import { Khan6o5 } from "./pages/khan-6.5/khan6o5";

// handle error bundary
function App() {
  const lastSolvedQuestion = useSelector(lastSolvedQuestionSelector);
  const isLoading = useSelector(isLoadingSelector);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const getUser = async () => {
      try {
        const user = await API.getUser();
        if (user) {
          dispatch(userActions.setUser(user));
          console.log("@#@# user", user);
        }
      } catch (error) {
      } finally {
        dispatch(userActions.setLoading(false));
      }
    };

    getUser();
  }, []);

  // Global cheat code: set step with number keys 1-7
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Ignore if typing in input/textarea
      }
      const key = e.key;
      if (key >= "1" && key <= "7") {
        dispatch(userActions.setLastSolvedQuestion(Number(key) - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { notificationText, setNotificationText } = useNotification();

  const handleCloseNotification = () => {
    setNotificationText("");
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <div>
        {lastSolvedQuestion === 0 && <Khan1 />}
        {lastSolvedQuestion === 1 && <Khan2 />}
        {lastSolvedQuestion === 2 && <Khan3 />}
        {lastSolvedQuestion === 3 && <Khan4 />}
        {lastSolvedQuestion === 4 && <Khan5 />}
        {lastSolvedQuestion === 5 && <Khan6 />}
        {lastSolvedQuestion === 6.5 && <Khan6o5 />}
        {lastSolvedQuestion === 6 && <Messanger />}
      </div>
      {notificationText && (
        <div className={styles.Notification} onClick={handleCloseNotification}>
          <pre
            dir={getTextDirection(notificationText)}
            className={styles.NotificationText}
          >
            {notificationText}
          </pre>
        </div>
      )}
    </>
  );
}

export default App;
