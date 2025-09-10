import { useState } from "react";
import styles from "./Khan2.module.scss";

import { PageProps } from "~/pages/khan-1/Khan1";
import { TypingText } from "~/components/TypingText/TypingText";
import { Slider } from "~/components/Slider/Slider";
import { Draggable } from "~/components/Draggable";

import folderIce from "./frozen_folder.png";

export const Khan2 = (props: PageProps) => {
    const texts = [
        "یه چیزایی یادمه...اون...همون دیگه...",
        "درست یادم نمیاد...شاید حافظمو ...حافظمو...",
    ];

    const [storyIsEnded, setStoryIsEnded] = useState(false);

    console.log("@#@# storyIsEnded", storyIsEnded);

    return (
        <div className={styles.Page}>
            <div className={styles.Content}>
                <video
                    src="/rakhsh_app/horse_states/confused_idle.mp4"
                    autoPlay
                    loop
                    muted
                    width={480}
                    height={480}
                />

                {storyIsEnded ? (
                    <Slider items={texts} startIndex={texts.length - 1} />
                ) : (
                    <TypingText
                        text={texts}
                        waitDelay={1000}
                        onComplete={() => setStoryIsEnded(true)}
                    />
                )}
            </div>

            <Draggable
                initialPosition={{ x: 20, y: 20 }}
                className={styles.FolderIce}
            >
                <img src={folderIce} className={styles.FolderIceImage} />
            </Draggable>
        </div>
    );
};

