import { useState } from "react";
import styles from "./Slider.module.scss";
import clsx from "clsx";

import backIcon from "./right_arrow.png";
import nextIcon from "./left_arrow.png";

const distance = "175%";

interface SliderProps {
    items: string[];
    startIndex: number;
}

export const Slider = (props: SliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(props.startIndex ?? 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");

    const handleBack = () => {
        if (currentIndex === 0) return;

        setIsAnimating(true);
        setDirection("left");
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const handleNext = () => {
        if (currentIndex === props.items.length - 1) return;

        setIsAnimating(true);
        setDirection("right");
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const translateXPreviousItem = () => {
        if (isAnimating && direction === "left") {
            return "0%";
        } else {
            return distance;
        }
    };

    const translateXCurrentItem = () => {
        if (isAnimating) {
            return direction === "left" ? `-${distance}` : distance;
        } else {
            return 0;
        }
    };

    const translateXNextItem = () => {
        if (isAnimating && direction === "right") {
            return "0%";
        } else {
            return `-${distance}`;
        }
    };

    console.log("@#@#", direction, isAnimating, translateXNextItem());

    return (
        <>
            <div className={styles.Controls}>
                <img
                    src={backIcon}
                    className={styles.BackIcon}
                    onClick={handleBack}
                    style={{
                        opacity: currentIndex === 0 ? 0.5 : 1,
                        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    }}
                />
                <img
                    src={nextIcon}
                    className={styles.NextIcon}
                    onClick={handleNext}
                    style={{
                        opacity:
                            currentIndex === props.items.length - 1 ? 0.5 : 1,
                        cursor:
                            currentIndex === props.items.length - 1
                                ? "not-allowed"
                                : "pointer",
                    }}
                />
            </div>
            <div className={styles.Slider}>
                <div
                    className={clsx(styles.Item, styles.PreviousItem)}
                    style={{
                        transform: `translateX(${translateXPreviousItem()})`,
                    }}
                >
                    {props.items[currentIndex - 1]}
                </div>
                <div
                    className={clsx(styles.Item, styles.CurrentItem)}
                    style={{
                        transform: `translateX(${translateXCurrentItem()})`,
                    }}
                >
                    {props.items[currentIndex]}
                </div>
                <div
                    className={clsx(styles.Item, styles.NextItem)}
                    style={{
                        transform: `translateX(${translateXNextItem()})`,
                    }}
                >
                    {props.items[currentIndex + 1]}
                </div>
            </div>
        </>
    );
};

