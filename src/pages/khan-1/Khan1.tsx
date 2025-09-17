import React, { useEffect, useState } from "react";
import styles from "./Khan1.module.scss";
import { Input } from "~/components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageProps } from "~/types";
import { useNotification } from "~/context/Notification";
import { PasswordInput } from "~/components";
import { API } from "~/api/api";
import { userActions } from "~/store/user/slice";
import { useDispatch } from "react-redux";

// todo: add teams template
const getLength = (nameTeam: string) => {
  switch (nameTeam) {
    case "مامور 001":
      return 4;
    case "قهرمان":
      return 5;
    case "اکسلنت‌ها":
      return 4;
    case "بازگشت اصلان":
      return 5;
    case "سه کله پوک":
      return 4;
    case "هیمالیا":
      return 5;
    case "وهوش":
      return 4;
    case "موقت: اینت":
      return 5;
    case "چای کرک":
      return 4;
    case "FourSure":
      return 5;
    case "حسین کبیر":
      return 4;
    case "پشتیبانی":
      return 5;
    case "شواهد":
      return 4;
    case "رادمردان عرصه کد":
      return 5;
    case "New Folder":
      return 4;
    case "سنگر":
      return 5;
    case "فرضی":
      return 4;
    case "فرضی2":
      return 5;
    default:
      return 4;
  }
};

export const Khan1 = (_props: PageProps) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

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

    if (inputs.password === "77777هفت") {
      dispatch(userActions.setLastSolvedQuestion(1));
    }

    if (inputs.username === "" || inputs.password === "") {
      return;
    }

    const handleLogin = async () => {
      const response = await API.login(inputs.username, inputs.password);

      if (response.success) {
        localStorage.setItem("token", response.message);
        const user = await API.getUser();
        if (user) {
          dispatch(userActions.setUser(user));
        }
        dispatch(userActions.setLastSolvedQuestion(1));
        await API.submitAnswer({
          question_id: 1,
          answer: inputs.password,
        });
      } else {
        setNotificationText(`مجوز ورود داده نشد.\n با تشکر حراست سداد...`);
      }
    };

    handleLogin();
  };

  const pattern = getLength(inputs.username);

  return (
    <div className={styles.Page}>
      <div className={styles.Content}>
        <video
          src="/rakhsh_app/horse_states/asleep.mp4"
          className={styles.Video}
          autoPlay
          loop
          muted
          width={480}
          height={480}
        />
        <form className={styles.Inputs} onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="شما؟"
            size="large"
            variant="outlined"
            fullWidth={false}
            value={inputs.username}
            onChange={(e) => handleFirstInputChange(e.target.value)}
            autoDirection={true}
          />

          <div className={styles.PasswordInput}>
            <PasswordInput
              length={pattern}
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

