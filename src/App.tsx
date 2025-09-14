import { useEffect, useState } from "react";
import { Khan1 } from "./pages/khan-1/Khan1";

import { Khan2 } from "./pages/khan-2/Khan2";
import styles from "./App.module.scss";
import { useNotification } from "./context/Notification";
import { Khan3 } from "./pages/khan-3/Khan3";
import Messanger from "./pages/khan-7/messenger";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { Khan4 } from "./pages/khan-4/Khan4";
import { getTextDirection } from "./utils";
import { Khan5 } from "./pages/khan-5/Khan5";
import { Khan6 } from "./pages/khan-6/Khan6";
import { Khan6o5 } from "./pages/khan-6.5/khan6o5";

function App() {
  const [step, setStep] = useState(1);

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
        setStep(Number(key));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { notificationText, setNotificationText } = useNotification();

  const handleCloseNotification = () => {
    setNotificationText("");
  };

  return (
    <>
      <Provider store={store}>
        <div>
          {step === 1 && <Khan1 setStep={setStep} />}
          {step === 2 && <Khan2 setStep={setStep} />}
          {step === 3 && <Khan3 setStep={setStep} />}
          {step === 4 && <Khan4 setStep={setStep} />}
          {step === 5 && <Khan5 setStep={setStep} />}
          {step === 6 && <Khan6 setStep={setStep} />}
          {step === 6.5 && <Khan6o5 setStep={setStep} />}
          {step === 7 && <Messanger />}
        </div>
        {notificationText && (
          <div
            className={styles.Notification}
            onClick={handleCloseNotification}
          >
            <pre
              dir={getTextDirection(notificationText)}
              className={styles.NotificationText}
            >
              {notificationText}
            </pre>
          </div>
        )}
      </Provider>
    </>
  );
}

export default App;
