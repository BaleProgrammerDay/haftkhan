import { useState } from "react";

interface Connection {
  from: number;
  to: number;
}

export const useWireConnections = () => {
  const [activeWire, setActiveWire] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

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

  return {
    connections,
    activeWire,
    handleWireButtonClick,
    isButtonConnected,
    isButtonActive,
    isButtonConnectable,
  };
};
