import { useEffect, useState } from "react";
import styles from "./TypingText.module.scss";
import { getTextDirection } from "../../utils";

interface TypingTextProps {
    text: string[];
    waitDelay?: number; // Delay after text is fully typed before next text
}

export const TypingText = (props: TypingTextProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const { waitDelay = 2000 } = props; // Default 2 seconds wait

    const handleTypingComplete = () => {
        setIsWaiting(true);

        // Only advance to next text if we're not at the last one
        if (currentTextIndex < props.text.length - 1) {
            setTimeout(() => {
                setCurrentTextIndex((prev) => prev + 1);
                setIsWaiting(false);
            }, waitDelay);
        }
    };

    return (
        <TypedText
            text={props.text[currentTextIndex] || ""}
            onTypingComplete={handleTypingComplete}
            isWaiting={isWaiting}
            key={currentTextIndex} // Force re-render when text changes
        />
    );
};

const TypedText = (props: {
    text: string;
    onTypingComplete?: () => void;
    isWaiting?: boolean;
}) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Reset state when component mounts or text changes
        setCurrentTextIndex(0);
        setIsTyping(false);

        // Start typing after a small delay
        const startTimer = setTimeout(() => {
            setIsTyping(true);
        }, 150);

        return () => clearTimeout(startTimer);
    }, [props.text]);

    useEffect(() => {
        if (!isTyping || !props.text) return;

        if (currentTextIndex >= props.text.length) {
            // Typing is complete, call the callback
            props.onTypingComplete?.();
            return;
        }

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => prev + 1);
        }, 125);

        return () => clearInterval(interval);
    }, [currentTextIndex, props.text, props.onTypingComplete, isTyping]);

    return (
        <div className={styles.TypedText} dir={getTextDirection(props.text)}>
            {isTyping && props.text
                ? props.text.slice(0, currentTextIndex)
                : ""}
        </div>
    );
};

