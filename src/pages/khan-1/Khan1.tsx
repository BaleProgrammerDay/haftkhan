import React, { useEffect, useState } from "react";
import styles from "./Khan1.module.scss";
import { Input } from "~/components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageProps } from "~/types";
import { useNotification } from "~/context/Notification";
import { PasswordInput } from "~/components";
import { API } from "~/api/api";

const getTemplate = (nameTeam: string) => {
  if (nameTeam === "منابع انسانی") {
    return "*** *** ***";
  } else if (nameTeam === "مهندسی نرم افزار") {
    return "*** ***";
  }
  return "";
};

export const Khan1 = (props: PageProps) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const { setNotificationText } = useNotification();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const handleValidation = () => {
      if (inputs.password === "") {
        setNotificationText(
          "یعنی فکر کردی ما چک نمی‌کنیم حتما گذرواژه رو وارد کنی؟"
        );
      }
      if (inputs.username === "") {
        setNotificationText("شما کیستی");
      }
    };
    handleValidation();

    if (inputs.username === "" || inputs.password === "") {
      return;
    }

    const handleLogin = async () => {
      const response = await API.login(inputs.username, inputs.password);

      if (response.success) {
        props.setStep(2);
      } else {
        setNotificationText(`مجوز ورود داده نشد.\n با تشکر حراست سداد...`);
      }
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

  const pattern = getTemplate(inputs.username);

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
        <form className={styles.Inputs} onSubmit={handleSubmit}>
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

          <div className={styles.PasswordInput}>
            <PasswordInput
              length={8}
              template={pattern}
              direction="rtl"
              onChange={(password) => handleSecondInputChange(password)}
            />
          </div>

          <Button variant="fill" size="large" type="submit">
            بیدار شو
          </Button>
        </form>
      </div>
    </div>
  );
};

