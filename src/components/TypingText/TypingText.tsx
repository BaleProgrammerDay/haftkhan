import { useEffect, useRef, useState } from "react";
import styles from "./TypingText.module.scss";
import { getTextDirection } from "../../utils";

interface TypingTextProps {
    text: string[];
    waitDelay?: number; // Delay after text is fully typed before next text
}

export const TypingText = (props: TypingTextProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const { waitDelay = 2000 } = props; // Default 2 seconds wait

    const handleComplete = () => {
        if (currentTextIndex == props.text.length - 1) return;
        setCurrentTextIndex((prev) => prev + 1);
    };

    // useEffect(() => {
    //     if (currentTextIndex < props.text.length - 1) {
    //         setTimeout(() => {
    //             setCurrentTextIndex((prev) => prev + 1);
    //         }, waitDelay);
    //     }
    // }, [currentTextIndex, props.text, waitDelay]);

    return (
        <TypedText
            text={props.text[currentTextIndex] || ""}
            onComplete={handleComplete}
            waitingTime={waitDelay}
        />
    );
};

const TypedText = (props: {
    text: string;
    onComplete: () => void;
    waitingTime: number;
}) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    console.log("@#@# text", currentTextIndex);

    const handleComplete = () => {
        setCurrentTextIndex(0);
        timeoutRef.current = setTimeout(() => {
            props.onComplete();
        }, props.waitingTime);
    };

    useEffect(() => {
        if (!props.text) return;

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => prev + 1);
        }, 125);

        if (currentTextIndex >= props.text.length) {
            // Typing is complete, call the callback
            clearInterval(interval);

            setCurrentTextIndex(0);
            handleComplete();
            return;
        }

        return () => clearInterval(interval);
    }, [currentTextIndex, props.text, handleComplete]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.TypedText} dir={getTextDirection(props.text)}>
            {props.text ? props.text.slice(0, currentTextIndex) : ""}
        </div>
    );
};

