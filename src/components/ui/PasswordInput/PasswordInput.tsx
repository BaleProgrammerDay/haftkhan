import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import styles from "./PasswordInput.module.scss";
import clsx from "clsx";

interface PasswordInputProsp {
  length: number;
  onChange: (password: string) => void;
  isDark?: boolean;
}

export interface PasswordInputRef {
  focus: () => void;
  clear: () => void;
}

export const PasswordInput = forwardRef<PasswordInputRef, PasswordInputProsp>(
  (props, ref) => {
    const [password, setPassword] = useState<string[]>(() =>
      new Array(props.length).fill("")
    );
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const inputs = new Array(props.length).fill(0);

    // Expose focus and clear methods to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      },
      clear: () => {
        const emptyPassword = new Array(props.length).fill("");
        setPassword(emptyPassword);
        props.onChange("");
      },
    }));

    const handleChange = (_password: string, index: number) => {
      const newPassword = [...password];
      newPassword[index] = _password;
      props.onChange(newPassword.join(""));
      setPassword(newPassword);
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
      } else if (password[index] && index < props.length - 1) {
        // Move to next input when current has value
        inputRefs.current[index + 1]?.focus();
      }
    };

    return inputs.map((_, index) => (
      <SinglePasswordInput
        {...props}
        key={index}
        index={index}
        value={password[index]}
        onChange={(password) => handleChange(password, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
      />
    ));
  }
);

interface SinglePasswordInputProps {
  length: number;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 1) return; // Only allow single character
    props.onChange(value);
  };

  return (
    <input
      ref={ref}
      type="password"
      value={props.value}
      onChange={handleChange}
      className={clsx(styles.PasswordInput, {
        [styles.Dark]: props.isDark,
      })}
      onKeyDown={props.onKeyDown}
      maxLength={props.length}
    />
  );
});

