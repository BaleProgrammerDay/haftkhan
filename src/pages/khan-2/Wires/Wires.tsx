import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Wires.module.scss";

interface WireButton {
  id: number;
  position: { x: number; y: number };
}

interface Connection {
  from: number;
  to: number;
}

interface WiresProps {
  connections: Connection[];
  onButtonClick: (buttonId: number) => void;
  isButtonConnected: (buttonId: number) => boolean;
  isButtonActive: (buttonId: number) => boolean;
  isButtonConnectable: (buttonId: number) => boolean;
  getButtonColor: (buttonId: number) => string;
  storyIsEnded: boolean;
}

export const Wires: React.FC<WiresProps> = ({
  connections,
  onButtonClick,
  isButtonConnected,
  isButtonActive,
  isButtonConnectable,
  getButtonColor,
  storyIsEnded,
}) => {
  const [wireButtons, setWireButtons] = useState<WireButton[]>([]);

  // Calculate wire button positions
  const updateButtonPositions = () => {
    // Find the content element by looking for the parent of wire buttons
    const firstButton = document.querySelector('[data-wire-button="0"]');
    if (!firstButton) return;

    const contentElement =
      firstButton.closest('[class*="Content"]') || firstButton.closest("div");
    if (!contentElement) return;

    const contentRect = contentElement.getBoundingClientRect();
    const buttons = [];

    // Get positions of all wire buttons
    for (let i = 0; i < 8; i++) {
      const buttonElement = document.querySelector(`[data-wire-button="${i}"]`);
      if (buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const x = buttonRect.left + buttonRect.width / 2 - contentRect.left;
        const y = buttonRect.top + buttonRect.height / 2 - contentRect.top;
        buttons.push({ id: i, position: { x, y } });
      }
    }

    setWireButtons(buttons);
  };

  // Initialize wire button positions
  useEffect(() => {
    // Delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      updateButtonPositions();
    }, 100);

    window.addEventListener("resize", updateButtonPositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateButtonPositions);
    };
  }, []);

  // Update positions when connections change
  useEffect(() => {
    updateButtonPositions();
  }, [connections]);

  // Left side buttons (0-3)
  const leftButtons = Array.from({ length: 4 }, (_, i) => i);

  // Right side buttons (4-7)
  const rightButtons = Array.from({ length: 4 }, (_, i) => i + 4);

  const renderButton = (buttonId: number) => (
    <div
      key={buttonId}
      data-wire-button={buttonId}
      className={clsx(styles.WireButton, {
        [styles.WireButtonActive]: isButtonActive(buttonId),
        [styles.WireButtonConnected]: isButtonConnected(buttonId),
        [styles.WireButtonConnectable]: isButtonConnectable(buttonId),
      })}
      onClick={() => onButtonClick(buttonId)}
      style={
        {
          "--button-color": getButtonColor(buttonId),
          "--button-color-light": getButtonColor(buttonId) + "40",
        } as React.CSSProperties
      }
    />
  );

  return (
    <>
      {/* Wire connections rendering */}
      <svg className={styles.WireCanvas}>
        {connections.map((connection, index) => {
          const fromButton = wireButtons.find(
            (btn) => btn.id === connection.from
          );
          const toButton = wireButtons.find((btn) => btn.id === connection.to);

          if (!fromButton || !toButton) {
            return null;
          }

          // Calculate the path length for animation
          const pathLength = Math.sqrt(
            Math.pow(toButton.position.x - fromButton.position.x, 2) +
              Math.pow(toButton.position.y - fromButton.position.y, 2)
          );

          return (
            <line
              key={index}
              x1={fromButton.position.x}
              y1={fromButton.position.y}
              x2={toButton.position.x}
              y2={toButton.position.y}
              stroke={getButtonColor(connection.from)}
              strokeWidth="3"
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              className={styles.WireDraw}
              style={
                {
                  "--path-length": pathLength,
                  "--animation-delay": `${index * 0.1}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>

      {/* Horse and wire buttons */}
      <div className={styles.Horse}>
        {/* Left side buttons */}
        {storyIsEnded && (
          <div className={styles.WireButtons}>
            {leftButtons.map(renderButton)}
          </div>
        )}

        {/* Horse video */}
        <video
          src={
            storyIsEnded
              ? "/rakhsh_app/horse_states/confused_idle.mp4"
              : "/rakhsh_app/horse_states/confused_speaking.mp4"
          }
          autoPlay
          loop
          muted
          className={styles.HorseVideo}
        />

        {/* Right side buttons */}
        {storyIsEnded && (
          <div className={styles.WireButtons}>
            {rightButtons.map(renderButton)}
          </div>
        )}
      </div>
    </>
  );
};

