import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API } from "~/api/api";
import { perQuestionSelector, userActions } from "~/store/user/slice";

interface Connection {
  from: number;
  to: number;
}

// todo: handle timeour when there is no remaining chances
// todo: handle add attempt history to user

export const MAX_TIMEOUT_ATTEMPTS_Khan2 = 3;

export const useWireConnections = () => {
  const [activeWire, setActiveWire] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const attemptHistory =
    useSelector(perQuestionSelector)?.[-2]?.attempt_history?.length || 0;

  const [_attemptHistory, _setAttemptHistory] = useState(attemptHistory);

  const dispatch = useDispatch();

  // Handle wire button click
  const handleWireButtonClick = (buttonId: number) => {
    if (activeWire === null) {
      // If button is already connected, disconnect it
      if (isButtonConnected(buttonId)) {
        disconnectButton(buttonId);
      } else {
        // Start a new wire connection
        setActiveWire(buttonId);
      }
    } else if (activeWire === buttonId) {
      // Cancel current wire
      setActiveWire(null);
    } else {
      // Complete the connection only if target button is not already connected
      if (!isButtonConnected(buttonId)) {
        // Check if connection already exists (both directions)
        const connectionExists = connections.some(
          (conn) =>
            (conn.from === activeWire && conn.to === buttonId) ||
            (conn.from === buttonId && conn.to === activeWire)
        );

        if (!connectionExists) {
          const newConnection = { from: activeWire, to: buttonId };
          console.log("Creating connection:", newConnection);
          setConnections((prev) => {
            const updated = [...prev, newConnection];
            console.log("Updated connections:", updated);
            return updated;
          });
        }
        setActiveWire(null);
      }
    }
  };

  // Disconnect a button from all its connections
  const disconnectButton = (buttonId: number) => {
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== buttonId && conn.to !== buttonId)
    );
  };

  // Check if a wire button is connected
  const isButtonConnected = (buttonId: number) => {
    return connections.some(
      (conn) => conn.from === buttonId || conn.to === buttonId
    );
  };

  // Check if a wire button is currently active
  const isButtonActive = (buttonId: number) => {
    return activeWire === buttonId;
  };

  // Check if a wire button can be connected to (when there's an active wire)
  const isButtonConnectable = (buttonId: number) => {
    return (
      activeWire !== null &&
      activeWire !== buttonId &&
      !isButtonConnected(buttonId)
    );
  };

  // Check for wire completion when connections change
  useEffect(() => {
    const checkCompletion = async () => {
      // Check if all 4 wires are connected (8 buttons total, 4 connections)
      if (connections.length === 4 && !isCompleted && !isChecking && !isError) {
        setIsChecking(true);

        const cleanConnections = connections.map((conn) => {
          if (conn.from > conn.to) {
            return { from: conn.to, to: conn.from };
          }
          return conn;
        });

        try {
          const result = await API.submitAnswer({
            question_id: 2,
            answer: cleanConnections
              .map((conn) => `${conn.from + 1}-${conn.to - 3}`)
              .join(","),
          });

          if (result.ok) {
            setIsCompleted(true);
            setIsError(false);
            dispatch(userActions.setLastSolvedQuestion(2));
          } else {
            // Wrong connections
            setIsError(true);
            const newAttemptHistory = attemptHistory + 1;
            _setAttemptHistory(newAttemptHistory);

            setErrorMessage(
              `سیم کشی رو اشتباه انجام دادی...\n` +
                (MAX_TIMEOUT_ATTEMPTS_Khan2 - newAttemptHistory >= 0
                  ? `${
                      newAttemptHistory == 0
                        ? "آخرین شانس"
                        : MAX_TIMEOUT_ATTEMPTS_Khan2 -
                          newAttemptHistory +
                          "شانس دیگر برام باقی مانده"
                    } `
                  : "")
            );

            // If no chances left, submit to question -2 to trigger timeout modal

            API.submitAnswer({
              question_id: -2,
              answer: "timeout_triggered",
            });

            setTimeout(() => {
              setConnections([]);
              setIsError(false);
              setErrorMessage("");
            }, 3000);
          }
        } catch (error) {
          console.error("Error checking wire completion:", error);
          setIsError(true);
          setErrorMessage("خطا در بررسی اتصالات");
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkCompletion();
  }, [connections, isCompleted, isChecking, isError]);

  // Reset function to restore chances and clear error state
  const resetChances = () => {
    _setAttemptHistory(0);
    setIsError(false);
    setErrorMessage("");
    setConnections([]);
  };

  return {
    connections,
    activeWire,
    handleWireButtonClick,
    isButtonConnected,
    isButtonActive,
    isButtonConnectable,
    isCompleted,
    isChecking,
    isError,
    errorMessage,
    _attemptHistory,
    resetChances,
  };
};

