import styles from "./Khan5.module.scss";
import { PageProps } from "~/types";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { TypingText } from "~/components/TypingText";
import { useState } from "react";

import desktop from "./desktop.png";

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

export const Khan5 = (_props: PageProps) => {
  const [showPortal, setShowPortal] = useState(false);
  const [portalX, setPortalX] = useState("");
  const [portalY, setPortalY] = useState("");
  const [videoState, setVideoState] = useState<
    "running" | "portal_start" | "portal_continue"
  >("running");
  const [showTypedText, setShowTypedText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);

  const [storyIsEnded, setStoryIsEnded] = useState(false);

  const handleTeleport = async () => {
    try {
      // Simulate teleport request - replace with actual API call
      // const response = await fetch("/api/teleport", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     x: Number(portalX),
      //     y: Number(portalY),
      //   }),
      // });

      // const response = JSON.stringify({
      //   success: true,
      // });

      // const result = await response.json();

      const result = true;

      if (result) {
        // Close portal and start video sequence
        setShowPortal(false);
        setVideoState("portal_start");
        setShowTypedText(true);

        // After 3 seconds, change to portal_continue and show enter button
        setTimeout(() => {
          setVideoState("portal_continue");
          setShowTypedText(false);
          setShowEnterButton(true);
        }, 7500);
      } else {
        alert("Teleport failed. Please try again.");
      }
    } catch (error) {
      console.error("Teleport error:", error);
      alert("Teleport failed. Please try again.");
    }
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

    if (
      percentageX >= 76 &&
      percentageX <= 78 &&
      percentageY > 34.5 &&
      percentageY <= 37
    ) {
      setShowPortal(true);
    }
  };

  const handleEnter = () => {
    _props.setStep(6);
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
                <h2 className={styles.PortalTitle}>🌌 Portal Coordinates</h2>
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
                      X Position:
                    </label>
                    <input
                      type="number"
                      value={portalX}
                      onChange={(e) => setPortalX(e.target.value)}
                      className={styles.CoordinateInput}
                      placeholder="Enter X coordinate"
                    />
                  </div>

                  <div className={styles.CoordinateItem}>
                    <label className={styles.CoordinateLabel}>
                      Y Position:
                    </label>
                    <input
                      type="number"
                      value={portalY}
                      onChange={(e) => setPortalY(e.target.value)}
                      className={styles.CoordinateInput}
                      placeholder="Enter Y coordinate"
                    />
                  </div>
                </div>

                <div className={styles.PortalActions}>
                  <button
                    className={styles.PortalButton}
                    onClick={handleTeleport}
                  >
                    🚀 Teleport
                  </button>
                  <button
                    className={styles.PortalButton}
                    onClick={() => setShowPortal(false)}
                  >
                    ❌ Cancel
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

