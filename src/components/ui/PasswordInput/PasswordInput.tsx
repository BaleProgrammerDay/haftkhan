import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import styles from "./PasswordInput.module.scss";
import clsx from "clsx";

interface PasswordInputProsp {
  length: number;
  template?: string; // Optional template string like "hello world" where spaces indicate word boundaries
  onChange: (password: string) => void;
  isDark?: boolean;
  direction?: 'ltr' | 'rtl'; // Text direction for arrow key navigation
}

export interface PasswordInputRef {
  focus: () => void;
  clear: () => void;
}

export const PasswordInput = forwardRef<PasswordInputRef, PasswordInputProsp>(
  (props, ref) => {
    // Parse template to identify character positions and word boundaries
    const templateInfo = useMemo(() => {
      if (!props.template) {
        return {
          charPositions: Array.from({ length: props.length }, (_, i) => i),
          spacePositions: [],
          totalChars: props.length,
          template: ""
        };
      }
      
      const chars = props.template.split('');
      const charPositions: number[] = [];
      const spacePositions: number[] = [];
      
      chars.forEach((char, index) => {
        if (char === ' ') {
          spacePositions.push(index);
        } else {
          charPositions.push(index);
        }
      });
      
      
      return {
        charPositions,
        spacePositions,
        totalChars: charPositions.length,
        template: props.template
      };
    }, [props.template, props.length]);

    const [password, setPassword] = useState<string[]>(() =>
      new Array(templateInfo.totalChars).fill("")
    );
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Expose focus and clear methods to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      },
      clear: () => {
        const emptyPassword = new Array(templateInfo.totalChars).fill("");
        setPassword(emptyPassword);
        props.onChange("");
      },
    }));

    const handleChange = (_password: string, index: number) => {
      const newPassword = [...password];
      newPassword[index] = _password;
      props.onChange(newPassword.join(""));
      setPassword(newPassword);
      
      // Auto-advance to next input if current input has a value and there's a next input
      if (_password && index < templateInfo.totalChars - 1) {
        // Use setTimeout to ensure the state update has been processed
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === "Backspace") {
        if (password[index]) {
          // If current input has value, clear it (don't move to previous)
          const newPassword = [...password];
          newPassword[index] = "";
          setPassword(newPassword);
          props.onChange(newPassword.join(""));
        } else if (index > 0) {
          // Only move to previous input if current is empty
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (props.direction === 'rtl') {
          // In RTL, left arrow goes to next input (visually right)
          if (index < templateInfo.totalChars - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        } else {
          // In LTR, left arrow goes to previous input
          if (index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (props.direction === 'rtl') {
          // In RTL, right arrow goes to previous input (visually left)
          if (index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        } else {
          // In LTR, right arrow goes to next input
          if (index < templateInfo.totalChars - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        }
      }
    };

    // Create the input elements with space visualization
    const renderInputs = () => {
      const elements: React.ReactNode[] = [];
      let charIndex = 0;
      
      for (let i = 0; i < (props.template?.length || templateInfo.totalChars); i++) {
        if (props.template && props.template[i] === ' ') {
          // Add visual space indicator
          elements.push(
            <div key={`space-${i}`} className={styles.SpaceIndicator}>
              <div className={styles.SpaceDot}></div>
            </div>
          );
        } else {
          // Add character input
          const currentCharIndex = charIndex; // Capture the current value
          elements.push(
            <SinglePasswordInput
              key={currentCharIndex}
              index={currentCharIndex}
              value={password[currentCharIndex]}
              isDark={props.isDark}
              onChange={(password) => handleChange(password, currentCharIndex)}
              onKeyDown={(e) => handleKeyDown(e, currentCharIndex)}
              ref={(el) => {
                inputRefs.current[currentCharIndex] = el;
              }}
            />
          );
          charIndex++;
        }
      }
      
      return elements;
    };

    return <div className={styles.PasswordInputContainer}>{renderInputs()}</div>;
  }
);

interface SinglePasswordInputProps {
  onChange: (password: string) => void;
  isDark?: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  index: number;
  value: string;
}

const SinglePasswordInput = React.forwardRef<
  HTMLInputElement,
  SinglePasswordInputProps
>((props, ref) => {
  const [isComposing, setIsComposing] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If we're composing (typing a multi-keystroke character), don't update yet
    if (isComposing) return;
    
    // Allow the input to handle composition, but only take the last character
    if (value.length > 1) {
      // Take only the last character for multi-character inputs
      const lastChar = value.slice(-1);
      props.onChange(lastChar);
    } else {
      props.onChange(value);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    const value = e.currentTarget.value;
    // Take the last character after composition is complete
    if (value.length > 0) {
      const lastChar = value.slice(-1);
      props.onChange(lastChar);
    }
  };

  return (
    <input
      ref={ref}
      type="password"
      value={props.value}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      className={clsx(styles.PasswordInput, {
        [styles.Dark]: props.isDark,
      })}
      onKeyDown={props.onKeyDown}
    />
  );
});

