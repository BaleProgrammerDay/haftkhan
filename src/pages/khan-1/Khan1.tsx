import { useEffect, useState } from "react";
import styles from "./Khan1.module.scss";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageProps } from "~/types";

export const Khan1 = (props: PageProps) => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState({
        username: "",
        password: "",
    });

    const handleFirstInputChange = (value: string) => {
        setInputs((prev) => ({
            ...prev,
            username: value,
        }));
    };

    const handleSecondInputChange = (value: string) => {
        setInputs((prev) => ({
            ...prev,
            password: value,
        }));
    };

    const handleSubmit = () => {
        const handleValidation = () => {
            setError({
                username: "",
                password: "",
            });
            if (inputs.password === "") {
                setError((prev) => ({
                    ...prev,
                    password: "گذرواژه چی هست؟",
                }));
            }
            if (inputs.username === "") {
                setError((prev) => ({
                    ...prev,
                    username: "نگفتی کی هستی.",
                }));
            }
        };
        handleValidation();

        if (error.username !== "" || error.password !== "") {
            return;
        }

        const handleLogin = async () => {
            // const response = await API.login(inputs.username, inputs.password);
            props.setStep(2);
        };

        handleLogin();
    };

    const [blurBg, setBlurBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlurBg((prev) => {
                if (prev + 1 >= 10) {
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={styles.Page}
            style={{ filter: blurBg > 0 ? `${blurBg}px` : "none" }}
        >
            <div className={styles.Content}>
                <video
                    src="/rakhsh_app/horse_states/asleep.mp4"
                    autoPlay
                    loop
                    muted
                    width={480}
                    height={480}
                />
                <div className={styles.Inputs}>
                    <Input
                        type="text"
                        placeholder="تو؟"
                        size="large"
                        variant="outlined"
                        fullWidth={false}
                        value={inputs.username}
                        onChange={(e) => handleFirstInputChange(e.target.value)}
                        autoDirection={true}
                    />
                    <Input
                        type="text"
                        placeholder="گذرواژه"
                        size="large"
                        variant="outlined"
                        fullWidth={false}
                        value={inputs.password}
                        onChange={(e) =>
                            handleSecondInputChange(e.target.value)
                        }
                        autoDirection={true}
                    />
                    {error.username !== "" && (
                        <p className={styles.ErrorText}>{error.username}</p>
                    )}
                    {error.password !== "" && (
                        <p className={styles.ErrorText}>{error.password}</p>
                    )}
                    <Button variant="fill" size="large" onClick={handleSubmit}>
                        بیدار شو
                    </Button>
                </div>
            </div>
        </div>
    );
};

