import { useState } from "react";
import { Khan1 } from "./pages/khan-1/Khan1";

import { Khan2 } from "./pages/khan-2/Khan2";
import styles from "./App.module.scss";
import { useNotification } from "./context/Notification";
import { Khan3 } from "./pages/khan-3/Khan3";

function App() {
  const [step, setStep] = useState(3);
  const [isKhan, setIsKhan] = useState(true);

  const { notificationText, setNotificationText } = useNotification();

  const handleCloseNotification = () => {
    setNotificationText("");
  };

  return (
    <>
      {isKhan ? (
        <div>
          {step === 1 && <Khan1 setStep={setStep} />}
          {step === 2 && <Khan2 setStep={setStep} />}
          {step === 3 && <Khan3 setStep={setStep} />}
        </div>
      ) : (
        <></>
      )}

      {notificationText && (
        <div className={styles.Notification} onClick={handleCloseNotification}>
          <p>{notificationText}</p>
        </div>
      )}
    </>
  );
}

export default App;
