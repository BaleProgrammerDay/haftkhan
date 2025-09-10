import { useEffect, useRef, useState } from "react";
import styles from "./TypingText.module.scss";
import { getTextDirection } from "../../utils";

interface TypingTextProps {
    text: string[];
    waitDelay?: number; // Delay after text is fully typed before next text
    onComplete?: () => void;
}

export const TypingText = (props: TypingTextProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const { waitDelay = 2000 } = props; // Default 2 seconds wait

    const handleComplete = () => {
        console.log(
            "@#@# inhandleCompolete",
            currentTextIndex,
            props.text.length
        );
        if (currentTextIndex >= props.text.length - 1) {
            console.log("@#@# afsadf", currentTextIndex, props.text.length);
            setCurrentTextIndex(props.text.length - 1);
            props.onComplete?.();
            return;
        }
        setCurrentTextIndex((prev) => prev + 1);
    };

    console.log("@#@# currentTextIndex hello", currentTextIndex);

    // useEffect(() => {
    //     if (currentTextIndex < props.text.length - 1) {
    //         setTimeout(() => {
    //             setCurrentTextIndex((prev) => prev + 1);
    //         }, waitDelay);
    //     }
    // }, [currentTextIndex, props.text, waitDelay]);

    console.log("@#@# afdf", props.text.length, currentTextIndex);

    return (
        <TypedText
            text={props.text[currentTextIndex] || ""}
            onComplete={handleComplete}
            waitingTime={waitDelay}
            storyIsEnded={props.text.length <= currentTextIndex}
        />
    );
};

const TypedText = (props: {
    text: string;
    onComplete: () => void;
    waitingTime: number;
    storyIsEnded: boolean;
}) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    console.log("@#@# text", props.storyIsEnded);

    const handleComplete = () => {
        setIsComplete(true);
        timeoutRef.current = setTimeout(() => {
            console.log("@#@# hello from here 2");
            setCurrentTextIndex(0);
            props.onComplete();
            setIsComplete(false);
        }, props.waitingTime);
    };

    useEffect(() => {
        console.log("@#@# hello from here", props.storyIsEnded, isComplete);
        if (props.storyIsEnded || isComplete) return;

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => prev + 1);
        }, 125);

        console.log(
            "@#@# props.storyIsEnded",
            props.storyIsEnded,
            currentTextIndex
        );

        if (currentTextIndex >= props.text.length) {
            // Typing is complete, call the callback
            clearInterval(interval);

            handleComplete();
            return;
        }

        return () => clearInterval(interval);
    }, [
        currentTextIndex,
        props.text,
        handleComplete,
        isComplete,
        props.storyIsEnded,
    ]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    console.log("@#@# in typing..", props.text, currentTextIndex);

    return (
        <div className={styles.TypedText} dir={getTextDirection(props.text)}>
            {props.text ? props.text.slice(0, currentTextIndex) : ""}
        </div>
    );
};

