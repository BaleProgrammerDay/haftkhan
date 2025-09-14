import { useEffect, useState, useRef } from "react";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { PasswordInput } from "~/components/ui";
import { Button } from "~/components/ui";
import { PageProps } from "~/types";
import { API } from "~/api/api";
import { useNotification } from "~/context/Notification";
import styles from "./Khan6.module.scss";

//todo
//در یک صفحه سیاه یک سری دیالوگ قبل از چیز های دیگه نمایش داده شود:

//چه قدر اینجا متروکه‌ست...
//حضور هیچ جنبنده‌ای رو حس نمی‌کنم
//ولی انگار یه جنازه اونجاست!
//بذار بریم سمتش...
//عه این که ارژنگه
//رو میز کارش مرده...
//بذار ببینم سیستمش باز میشه؟
//اه رمز می‌خواد!
//بذار بگردم ببینم چیز دیگه‌ای هم پیدا میشه؟
//انگار داشته یه چیزی ضبط می‌کرده...
//بیا ببینیم چیزیم ذخیره شده؟؟

//بعد از وارد کردن رمز:
//سیستمش باز شد! نگاه کن اکانت بله‌ش بالاست.

export const Khan6 = (_props: PageProps) => {
  const [showFirstText, setShowFirstText] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [startSecondAnimation, setStartSecondAnimation] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [startCongratulationsAnimation, setStartCongratulationsAnimation] = useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setNotificationText } = useNotification();

  const firstText = "لطفا توجه کنید";
  const secondText = "برای تجربه بهتر از هدفون یا اسپیکر استفاده کنید...";

  useEffect(() => {
    // Start the first text animation sequence after 3 seconds
    const firstTimer = setTimeout(() => {
      setStartAnimation(true);

      // Hide first text and show second text after animation completes
      setTimeout(() => {
        setShowFirstText(false);
        setShowSecondText(true);

        // Start second text animation after 3 seconds
        setTimeout(() => {
          setStartSecondAnimation(true);

          // Hide second text after animation completes and show video + form together
          setTimeout(() => {
            setShowSecondText(false);
            setShowVideo(true);
            setShowForm(true); // Show form at the same time as video
          }, 1500); // Wait for sound wave animation to complete
        }, 4000);
      }, 1600); // Wait for first animation to complete (0.8s + buffer)
    }, 4000);

    return () => clearTimeout(firstTimer);
  }, []);

  const renderAnimatedText = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className={`${styles.Letter} ${startAnimation ? styles.falling : ""}`}
        style={{
          animationDelay: `${index * 0.1}s`, // Stagger the animation for each letter
        }}
      >
        {char === " " ? "\u00A0" : char}{" "}
        {/* Non-breaking space for actual spaces */}
      </span>
    ));
  };

  const renderCongratulationsText = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className={`${styles.CongratulationsLetter} ${startCongratulationsAnimation ? styles.disappearing : ""}`}
        style={{
          animationDelay: `${index * 0.1}s`, // Stagger the animation for each letter
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const handleSubmit = async () => {
    const cleanPassword = password.replace(/\s/g, ""); // Remove spaces
    if (cleanPassword.length === 4) {
      setIsLoading(true);
      
      try {
        const isValid = await API.khan6API(cleanPassword);
        
        if (isValid) {
          // Hide the video and form, show congratulations text
          setShowVideo(false);
          setShowForm(false);
          setShowCongratulations(true);
          
          // Handle successful password validation
          console.log("Password is correct:", cleanPassword);
          
          // Start the character disappearing animation after 1 second
          setTimeout(() => {
            setStartCongratulationsAnimation(true);
          }, 1000);
          
          // Hide congratulations and show folder after animation completes
          setTimeout(() => {
            setShowCongratulations(false);
            setShowFolder(true);
          }, 3000);
          
          // Navigate to step 6.5 after showing the folder
          setTimeout(() => {
            _props.setStep(6.5);
          }, 5000);
        } else {
          setNotificationText("رمز عبور اشتباه است. دوباره تلاش کنید. ❌");
        }
      } catch (error) {
        console.error("Error validating password:", error);
        setNotificationText("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید. ⚠️");
      } finally {
        setIsLoading(false);
      }
    } else {
      setNotificationText("لطفاً رمز عبور 4 رقمی وارد کنید.");
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Handle audio end event
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleAudioEnd = () => {
        setIsAudioPlaying(false);
      };

      audio.addEventListener('ended', handleAudioEnd);

      // Cleanup event listener
      return () => {
        audio.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [showForm]); // Re-run when form shows (when audio element is created)

  return (
    <Page>
      <PageContent>
        <div className={styles.Container}>
          {(showFirstText || showSecondText) && (
            <div className={styles.TextContainer}>
              {showFirstText && (
                <div className={styles.FirstText}>
                  {renderAnimatedText(firstText)}
                </div>
              )}

              {showSecondText && (
                <div
                  className={`${styles.SecondText} ${
                    startSecondAnimation ? styles.waveOut : ""
                  }`}
                >
                  {secondText}
                </div>
              )}
            </div>
          )}

          {showCongratulations && (
            <div className={styles.CongratulationsContainer}>
              <div className={styles.CongratulationsText}>
                {renderCongratulationsText("تبریک میگم شما وارد سیستم اولاد شدید")}
              </div>
            </div>
          )}

          {showFolder && (
            <div className={styles.FolderContainer}>
              <img 
                src="/src/assets/folder.png" 
                alt="Folder" 
                className={styles.FolderImage}
              />
            </div>
          )}

          {(showVideo || showForm) && (
            <div className={styles.VideoAndFormContainer}>
              {showVideo && (
                <div className={styles.VideoContainer}>
                  <video
                    className={styles.Video}
                    muted
                    autoPlay
                    loop
                  >
                    <source
                      src={"/rakhsh_app/horse_states/voice.mp4"}
                      type="video/mp4"
                    />
                  </video>
                </div>
              )}

              {showForm && (
                <div className={styles.FormContainer}>
                  <audio
                    ref={audioRef}
                    preload="auto"
                  >
                    <source src="/src/pages/khan-6/olad.wav" type="audio/wav" />
                  </audio>
                  <button
                    className={styles.PlayPauseButton}
                    onClick={toggleAudioPlayback}
                  >
                    <img
                      src={
                        isAudioPlaying
                          ? "/rakhsh_app/icons/pause.jpg"
                          : "/rakhsh_app/icons/play.jpg"
                      }
                      alt={isAudioPlaying ? "Pause" : "Play"}
                      className={styles.PlayPauseIcon}
                    />
                  </button>
                  <div className={styles.HashtagText}>
                    #people#notification#gunshot#clap
                  </div>
                  <PasswordInput
                    length={4}
                    onChange={setPassword}
                    direction="ltr"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={styles.SubmitButton}
                  >
                    {isLoading ? "در حال بررسی..." : "ورود"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContent>
    </Page>
  );
};

