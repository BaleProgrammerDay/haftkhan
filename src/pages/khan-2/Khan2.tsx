import { useState } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/types";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";

import { Scratch } from "./Scratch";
import { Wires, useWireConnections } from "./Wires";
import { Folders } from "./Folder";

const password = "1234";

export const Khan2 = (_props: PageProps) => {
  const texts = [
    "یه چیزایی یادمه...اون...همون دیگه...",
    "درست یادم نمیاد...شاید حافظمو ...حافظمو...",
  ];

  const [storyIsEnded, setStoryIsEnded] = useState(true);

  // Wire connection logic
  const {
    connections,
    handleWireButtonClick,
    isButtonConnected,
    isButtonActive,
    isButtonConnectable,
  } = useWireConnections();

  // Wire button colors - paired for left and right sides
  const wireButtonColors = [
    "#b37feb", // Red - Button 0 (left) and 4 (right)
    "#fff3ae", // Teal - Button 1 (left) and 5 (right)
    "#00d1a8", // Blue - Button 2 (left) and 6 (right)
    "#4fc3f7", // Green - Button 3 (left) and 7 (right)
  ];

  // Get the color for a wire button
  const getButtonColor = (buttonId: number) => {
    // Map right-side buttons (4-7) to same colors as left-side siblings (0-3)
    const colorIndex = buttonId >= 4 ? buttonId - 4 : buttonId;
    return wireButtonColors[colorIndex] || "#FF6B6B";
  };

  return (
    <div className={styles.Page}>
      <div className={styles.Content}>
        {/* Wire system - only show after horse dialogue ends */}

        <Wires
          connections={connections}
          onButtonClick={handleWireButtonClick}
          isButtonConnected={isButtonConnected}
          isButtonActive={isButtonActive}
          isButtonConnectable={isButtonConnectable}
          getButtonColor={getButtonColor}
          storyIsEnded={storyIsEnded}
        />

        {storyIsEnded ? (
          <Slider items={texts} startIndex={texts.length - 1} />
        ) : (
          <TypingText
            text={texts}
            waitDelay={1000}
            onComplete={() => {
              setStoryIsEnded(true);
            }}
          />
        )}
      </div>

      {/* Folders - only show after horse dialogue ends */}
      {storyIsEnded && <Folders password={password} />}

      {/* Scratch - only show after horse dialogue ends */}
      {storyIsEnded && <Scratch password={password} />}
    </div>
  );
};

