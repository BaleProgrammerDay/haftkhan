import { useState } from "react";
import styles from "./Khan2.module.scss";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { API } from "../../api/api";
import { PageProps } from "../khan-1/Khan1";

export const Khan2 = (props: PageProps) => {
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
            </div>
        </div>
    );
};

