import { useState, useEffect } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/pages/khan-1/Khan1";
import { TypingText } from "~/components/TypingText/TypingText";

export const Khan2 = (props: PageProps) => {
    const texts = [
        "یه چیزایی یادمه...اون...همون دیگه...",
        "درست یادم نمیاد...شاید حافظمو ...حافظمو...",
    ];

    const [blurValue, setBlurValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlurValue((prev) => {
                if (prev >= 10) return 0; // Reset to 0 when reaching 10px
                return prev + 0.5; // Increase by 0.5px every 250ms
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.Page}>
            <div
                className={styles.BlurOverlay}
                style={{
                    filter: `blur(${blurValue}px)`,
                }}
            />

            <div className={styles.Content}>
                <video
                    src="/rakhsh_app/horse_states/confused_idle.mp4"
                    autoPlay
                    loop
                    muted
                    width={480}
                    height={480}
                />

                <TypingText text={texts} waitDelay={1000} />
            </div>
        </div>
    );
};

