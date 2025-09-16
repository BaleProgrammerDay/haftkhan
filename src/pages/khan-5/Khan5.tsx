import styles from "./Khan5.module.scss";
import { PageProps } from "~/types";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { TypingText } from "~/components/TypingText";
import { useState } from "react";

import desktop from "./desktop.png";
import { API } from "~/api/api";
import { useDispatch } from "react-redux";
import { userActions } from "~/store/user/slice";
import { useNotification } from "~/context/Notification";

const texts = ["بالاخره پس از ۵ خان رسیدیم", "رسیدیم به دروازه"];

//todo dialogs
//آخیش! بالاخره یادم اومد!
//من یه سرنخی از ورودی قلعۀارژنگ به دست آورده بودم... از اونجا می‌تونیم به دیو سپید دسترسی پیدا کنیم.
//فقط کافیه مختصات رو از روی نقشه پیدا کنی و بهم بگی.

//وقتی روی برنامه اشتباهی زد این تست نمایش داده بشه:
//الان وقت این کارارو نداریم!

//برای مختصات سه عدد میخوایم. شماره نقشه. x و y. مختصات میتونه منفی هم باشه چون نقطه وسط ۰ و ۰ ئه

//بعد که مختصات رو درست وارد کرد:
// دکمه ای با نام "ورود به قلعۀ ارژنگ" نمایش داده میشود.

// todo: add api
// todo: add dialogs

export const Khan5 = (_props: PageProps) => {
  const [showPortal, setShowPortal] = useState(false);
  const [portalX, setPortalX] = useState("");
  const [portalY, setPortalY] = useState("");
  const [mapNumber, setMapNumber] = useState("");
  const [videoState, setVideoState] = useState<
    "running" | "portal_start" | "portal_continue"
  >("running");
  const [showTypedText, setShowTypedText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);

  const dispatch = useDispatch();

  const { setNotificationText } = useNotification();

  const handleTeleport = async () => {
    const callAPI = async () => {
      const data = await API.submitAnswer({
        question_id: 5,
        answer: portalX + "," + portalY + "," + mapNumber,
      });

      if (data.ok) {
        setShowPortal(false);
        setVideoState("portal_start");
        setShowTypedText(true);

        setTimeout(() => {
          setVideoState("portal_continue");
          setShowTypedText(false);
          setShowEnterButton(true);
        }, 7500);
      } else {
        setNotificationText("مختصات اشتباه است");
      }
    };

    callAPI();
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const desktopElement = e.currentTarget;
    const rect = desktopElement.getBoundingClientRect();

    // Calculate relative x and y coordinates within the desktop image
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    // Calculate percentage coordinates (0-100%)
    const percentageX = (relativeX / rect.width) * 100;
    const percentageY = (relativeY / rect.height) * 100;

    console.log(percentageX, percentageY);

    if (
      percentageX >= 18.8 &&
      percentageX <= 21 &&
      percentageY > 73.28 &&
      percentageY <= 76.64
    ) {
      setShowPortal(true);
      setShowEnterButton(false);
    }
  };

  const handleEnter = () => {
    dispatch(userActions.setLastSolvedQuestion(5));
  };

  return (
    <Page>
      <PageContent>
        <div className={styles.Container}>
          <div className={styles.VideoContainer}>
            <img
              src={desktop}
              className={styles.Desktop}
              onClick={handleClick}
              draggable={false}
            />
            <video
              key={videoState}
              className={styles.Video}
              muted
              autoPlay
              loop
            >
              <source
                src={
                  videoState === "running"
                    ? "/rakhsh_app/horse_states/running.mp4"
                    : videoState === "portal_start"
                    ? "/rakhsh_app/horse_states/portal_start.mp4"
                    : "/rakhsh_app/horse_states/portal_continue.mp4"
                }
                type="video/mp4"
              />
            </video>
            {showTypedText && (
              <div className={styles.VideoText}>
                <TypingText
                  text={texts}
                  onComplete={() => {}}
                  waitDelay={1000}
                  // keepLastText={!showPortal}
                />
              </div>
            )}

            {/* Enter Button Overlay */}
            {showEnterButton && (
              <div className={styles.EnterButtonOverlay}>
                <button className={styles.EnterButton} onClick={handleEnter}>
                  ورود
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Portal Overlay */}
        {showPortal && (
          <div className={styles.PortalOverlay}>
            <div className={styles.Portal}>
              <div className={styles.PortalHeader}>
                <h2 className={styles.PortalTitle}> مختصات جا به جایی</h2>
                <button
                  className={styles.CloseButton}
                  onClick={() => setShowPortal(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.PortalContent}>
                <div className={styles.CoordinateDisplay}>
                  <div className={styles.CoordinateItem}>
                    <label className={styles.CoordinateLabel}>
                      شماره نقشه:
                    </label>
                    <input
                      type="number"
                      value={mapNumber}
                      onChange={(e) => setMapNumber(e.target.value)}
                      className={styles.CoordinateInput}
                      placeholder="شماره نقشه را وارد کنید"
                    />
                  </div>

                  <div className={styles.CoordinateItem}>
                    <label className={styles.CoordinateLabel}>
                      طول جغرافیایی:
                    </label>
                    <input
                      type="number"
                      value={portalX}
                      onChange={(e) => setPortalX(e.target.value)}
                      className={styles.CoordinateInput}
                      placeholder="طول جغرافیایی را وارد کنید"
                    />
                  </div>

                  <div className={styles.CoordinateItem}>
                    <label className={styles.CoordinateLabel}>
                      عرض جغرافیایی:
                    </label>
                    <input
                      type="number"
                      value={portalY}
                      onChange={(e) => setPortalY(e.target.value)}
                      className={styles.CoordinateInput}
                      placeholder="عرض جغرافیایی را وارد کنید"
                    />
                  </div>
                </div>

                <div className={styles.PortalActions}>
                  <button
                    className={styles.PortalButton}
                    onClick={handleTeleport}
                  >
                    طی‌الارض
                  </button>
                  <button
                    className={styles.PortalButton}
                    onClick={() => setShowPortal(false)}
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </Page>
  );
};

