import React, { forwardRef, useMemo } from "react";
import styles from "./Input.module.scss";
import { getTextDirection } from "../../utils/textDirection";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * The label for the input field
     */
    label?: string;
    /**
     * Error message to display below the input
     */
    error?: string;
    /**
     * Helper text to display below the input
     */
    helperText?: string;
    /**
     * Whether the input is in a loading state
     */
    loading?: boolean;
    /**
     * Size variant of the input
     */
    size?: "small" | "medium" | "large";
    /**
     * Visual variant of the input
     */
    variant?: "default" | "outlined" | "filled";
    /**
     * Whether the input should take full width
     */
    fullWidth?: boolean;
    /**
     * Icon to display at the start of the input
     */
    startIcon?: React.ReactNode;
    /**
     * Icon to display at the end of the input
     */
    endIcon?: React.ReactNode;
    /**
     * Whether to automatically detect text direction based on content
     */
    autoDirection?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            loading = false,
            size = "medium",
            variant = "default",
            fullWidth = false,
            startIcon,
            endIcon,
            autoDirection = true,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        // Auto-detect text direction based on current value and placeholder
        const textDirection = useMemo(() => {
            if (!autoDirection) return "ltr";

            // Check both value and placeholder for direction
            const valueText = props.value ? String(props.value) : "";
            const placeholderText = props.placeholder
                ? String(props.placeholder)
                : "";

            // If there's a value, use its direction
            if (valueText) {
                return getTextDirection(valueText);
            }

            // If no value but there's a placeholder, use placeholder direction
            if (placeholderText) {
                return getTextDirection(placeholderText);
            }

            return "ltr";
        }, [autoDirection, props.value, props.placeholder]);

        const inputClasses = [
            styles.input,
            styles[`input--${size}`],
            styles[`input--${variant}`],
            error && styles["input--error"],
            disabled && styles["input--disabled"],
            fullWidth && styles["input--fullWidth"],
            className,
        ]
            .filter(Boolean)
            .join(" ");

        const containerClasses = [
            styles.inputContainer,
            fullWidth && styles["inputContainer--fullWidth"],
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <div className={containerClasses}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                    </label>
                )}
                <div className={styles.inputWrapper}>
                    {startIcon && (
                        <div className={styles.startIcon}>{startIcon}</div>
                    )}
                    <input
                        ref={ref}
                        className={inputClasses}
                        disabled={disabled || loading}
                        dir={textDirection}
                        {...props}
                    />
                    {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
                    {loading && (
                        <div className={styles.loadingSpinner}>
                            <div className={styles.spinner} />
                        </div>
                    )}
                </div>
                {error && <div className={styles.errorText}>{error}</div>}
                {helperText && !error && (
                    <div className={styles.helperText}>{helperText}</div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;

