import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface NotificationContextType {
  notificationText: string;
  setNotificationText: (notificationText: string) => void;
}

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationContext = createContext<NotificationContextType>({
  notificationText: "",
  setNotificationText: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notificationText, _setNotificationText] = useState("");
  const [shouldCloseByTimer, setShouldCloseByTimer] = useState(true);
  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setNotificationText = useCallback((notificationText: string) => {
    setShouldCloseByTimer(false);
    _setNotificationText(notificationText);

    if (timerRef2.current) {
      clearTimeout(timerRef2.current);
    }
    timerRef2.current = setTimeout(() => {
      setShouldCloseByTimer(true);
    }, 100);
  }, []);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (notificationText) {
      if (!shouldCloseByTimer) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        return;
      }
      timerRef.current = setTimeout(() => {
        _setNotificationText("");
      }, 3000);
    }
  }, [notificationText, shouldCloseByTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (timerRef2.current) {
        clearTimeout(timerRef2.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notificationText, setNotificationText }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

