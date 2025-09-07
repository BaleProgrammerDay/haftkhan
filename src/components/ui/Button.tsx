import React, { forwardRef } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual variant of the button
     */
    variant?: "fill" | "text" | "outline";
    /**
     * Size of the button
     */
    size?: "small" | "medium" | "large";
    /**
     * Whether the button should take full width
     */
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "fill",
            size = "medium",
            fullWidth = false,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const buttonClasses = [
            styles.button,
            styles[`button--${variant}`],
            styles[`button--${size}`],
            fullWidth && styles["button--fullWidth"],
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <button ref={ref} className={buttonClasses} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
