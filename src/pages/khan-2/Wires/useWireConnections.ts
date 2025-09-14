import { useState, useEffect } from "react";
import { API } from "~/api/api";

interface Connection {
  from: number;
  to: number;
}

export const useWireConnections = () => {
  const [activeWire, setActiveWire] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingChances, setRemainingChances] = useState(3);

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
      activeWire !== null && activeWire !== buttonId && !isButtonConnected(buttonId)
    );
  };

  // Check for wire completion when connections change
  useEffect(() => {
    const checkCompletion = async () => {
      // Check if all 4 wires are connected (8 buttons total, 4 connections)
      if (connections.length === 4 && !isCompleted && !isChecking && !isError) {
        setIsChecking(true);
        console.log("All wires connected! Checking with API...");
        
        try {
          const result = await API.checkWireCompletion(connections);
          console.log("Wire completion result:", result);
          
          if (result.success) {
            setIsCompleted(true);
            setIsError(false);
            console.log("Wire completion successful!");
          } else {
            // Wrong connections
            setIsError(true);
            setErrorMessage(result.message || "سیم کشی اشتباه انجام شد");
            setRemainingChances(prev => Math.max(0, prev - 1));
            console.log("Wire completion failed:", result.message);
            
            // Reset connections after 3 seconds to allow retry
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
    remainingChances,
  };
};
