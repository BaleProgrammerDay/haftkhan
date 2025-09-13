import { useState } from "react";
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

function App() {
  const [step, setStep] = useState(1);
  const [isKhan, setIsKhan] = useState(true);

  const { notificationText, setNotificationText } = useNotification();

  const handleCloseNotification = () => {
    setNotificationText("");
  };

  return (
    <>
      <Provider store={store}>
        {isKhan ? (
          <div>
            {step === 1 && <Khan1 setStep={setStep} />}
            {step === 2 && <Khan2 setStep={setStep} />}
            {step === 3 && <Khan3 setStep={setStep} />}
            {step === 4 && <Khan4 />}
          </div>
        ) : (
          <Messanger />
        )}
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
