import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./TypingText.module.scss";
import { getTextDirection } from "../../utils";

interface TypingTextProps {
  text: string[];
  waitDelay?: number; // Delay after text is fully typed before next text
  onComplete?: () => void;
  keepLastText?: boolean;
}

export const TypingText = (props: TypingTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { waitDelay = 2000 } = props; // Default 2 seconds wait
  const [keepLastText, setKeepLastText] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const handleComplete = () => {
    if (currentTextIndex >= props.text.length - 1) {
      setCurrentTextIndex(props.text.length - 1);
      if (props.keepLastText) {
        setKeepLastText(true);
      }
      props.onComplete?.();
      setIsEnded(true);
      return;
    }
    setCurrentTextIndex((prev) => prev + 1);
  };

  return (
    <TypedText
      text={props.text[currentTextIndex] || ""}
      onComplete={handleComplete}
      waitingTime={waitDelay}
      storyIsEnded={isEnded}
      keepLastText={keepLastText}
    />
  );
};

export const TypedText = (props: {
  text: string;
  onComplete: () => void;
  waitingTime: number;
  storyIsEnded: boolean;
  speed?: number; // 125 is default
  keepLastText?: boolean;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = () => {
    setIsComplete(true);
    timeoutRef.current = setTimeout(() => {
      setCurrentTextIndex(0);
      props.onComplete();
      setIsComplete(false);
    }, props.waitingTime);
  };

  useEffect(() => {
    // console.log("@#@#", props.text[0], props.storyIsEnded);
    if (props.storyIsEnded || isComplete) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => prev + 1);
    }, props.speed ?? 125);

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

  return (
    <div className={styles.TypedText} dir={getTextDirection(props.text)}>
      {props.text
        ? props.text.slice(
            0,
            props.keepLastText ? props.text.length : currentTextIndex
          )
        : ""}
    </div>
  );
};

interface ManualTypingTextProps extends TypingTextProps {
  goNext?: () => void; // Optional callback when advancing to next text
}

export interface ManualTypingTextRef {
  goNext: () => void; // Method to manually advance to next text
}

export const ManualTypingText = forwardRef<
  ManualTypingTextRef,
  ManualTypingTextProps
>((props, ref) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [keepLastText, setKeepLastText] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goNext = () => {
    console.log("its called", currentTextIndex, props.text.length);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentTextIndex >= props.text.length - 1) {
      // If we're at the last text, keep it and call onComplete
      if (props.keepLastText) {
        setKeepLastText(true);
      }
      props.onComplete?.();
      setIsEnded(true);
      return;
    }

    // Apply delay before moving to next text
    timeoutRef.current = setTimeout(() => {
      setCurrentTextIndex((prev) => prev + 1);
      props.goNext?.();
    }, props.waitDelay ?? 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Expose goNext method through ref
  useImperativeHandle(ref, () => ({
    goNext,
  }));

  return (
    <TypedText
      text={props.text[currentTextIndex] || ""}
      // onComplete={goNext}
      onComplete={props.onComplete ?? (() => {})}
      waitingTime={props.waitDelay ?? 1000}
      storyIsEnded={isEnded}
      keepLastText={keepLastText}
    />
  );
});

