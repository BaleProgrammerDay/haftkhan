import { useState, KeyboardEvent } from "react";
import { Button } from "~/components/ui/Button";
import styles from "./ConversationInput.module.scss";

interface ConversationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ConversationInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ConversationInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div
      className={`${styles.ConversationInput} ${
        isFocused ? styles.focused : ""
      }`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        dir="rtl"
      />
      <Button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={styles.sendButton}
      >
        Send
      </Button>
    </div>
  );
};

