import { useEffect, useState, useRef } from "react";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { PasswordInput } from "~/components/ui";
import { Button } from "~/components/ui";
import { PageProps } from "~/types";
import { API } from "~/api/api";
import { useNotification } from "~/context/Notification";
import styles from "./Khan6.module.scss";
import comic from "./comic.jpg";
import { userActions, perQuestionSelector } from "~/store/user/slice";
import { useDispatch, useSelector } from "react-redux";
import { TimeoutModal } from "~/components/TimeoutModal";
import { khan6Facts } from "./facts";

//بعد از وارد کردن رمز:
//سیستمش باز شد! نگاه کن اکانت بله‌ش بالاست.

// todo: add api
// todo: add dialogs

export const Khan6 = (_props: PageProps) => {
  // Initial comic state
  const [showComic, setShowComic] = useState(true);
  const [comicFade, setComicFade] = useState<"in" | "out">("in");
  const [showFirstText, setShowFirstText] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [startSecondAnimation, setStartSecondAnimation] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [startCongratulationsAnimation, setStartCongratulationsAnimation] =
    useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutTriggeredAt, setTimeoutTriggeredAt] = useState<
    string | undefined
  >();

  const audioRef = useRef<HTMLAudioElement>(null);
  const { setNotificationText } = useNotification();

  const videoRef = useRef<HTMLVideoElement>(null);

  const firstText = "لطفا توجه کنید";
  const secondText = "برای تجربه بهتر از هدفون یا اسپیکر استفاده کنید...";

  const dispatch = useDispatch();
  const perQuestion = useSelector(perQuestionSelector);
  const timeoutAttemptHistory = perQuestion?.[-6]?.attempt_history?.length || 0;

  const [remainingChances, setRemainingChances] = useState(
    timeoutAttemptHistory > 0 ? 0 : 3
  );

  // Check if user should see timeout modal on component mount
  useEffect(() => {
    if (!showVideo) return;
    if (timeoutAttemptHistory > 0 && timeoutAttemptHistory % 2 == 1) {
      setShowTimeoutModal(true);
      setTimeoutTriggeredAt(new Date().toISOString());
    }
  }, [timeoutAttemptHistory, showVideo]);

  useEffect(() => {
    if (showComic) return; // Don't start animation until comic is dismissed
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
  }, [showComic]);

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
        className={`${styles.CongratulationsLetter} ${
          startCongratulationsAnimation ? styles.disappearing : ""
        }`}
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

    const callAPI = async () => {
      const data = await API.submitAnswer({
        question_id: 6,
        answer: cleanPassword,
      });

      if (data.ok) {
        dispatch(userActions.setLastSolvedQuestion(6.5));
        setShowCongratulations(true);
        setStartCongratulationsAnimation(true);
        setTimeout(() => {
          setShowFolder(true);
        }, 2000);
      } else {
        // Wrong password - reduce chances
        const newRemainingChances = remainingChances - 1;
        setRemainingChances(newRemainingChances);

        if (newRemainingChances > 0) {
          setNotificationText(
            `رمز عبور اشتباه است. ${newRemainingChances} شانس دیگر باقی مانده. ❌`
          );
        } else {
          // No chances left - trigger timeout
          setNotificationText("رمز عبور اشتباه است. سیستم قفل شد! 🔒");
          setShowTimeoutModal(true);
          setTimeoutTriggeredAt(new Date().toISOString());

          // Submit to question -2 to track timeout
          await API.submitAnswer({
            question_id: -6,
            answer: "timeout_triggered",
          });
        }
      }
    };

    callAPI();
  };

  // Handle timeout modal close - reset chances and submit completion
  const handleTimeoutModalClose = async () => {
    setShowTimeoutModal(false);
    // Submit answer to question -2 to mark that modal was shown and closed
    await API.submitAnswer({
      question_id: -6,
      answer: "modal_completed",
    });
    // Reset chances when modal closes
    setRemainingChances(0);
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        videoRef.current?.pause();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      } else {
        audioRef.current.play();
        videoRef.current?.play();
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
        videoRef.current?.pause();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      };

      audio.addEventListener("ended", handleAudioEnd);

      // Cleanup event listener
      return () => {
        audio.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, [showForm]); // Re-run when form shows (when audio element is created)

  return (
    <Page>
      <PageContent>
        <div className={styles.Container}>
          {showComic ? (
            <div className={styles.ComicContainer}>
              <div
                className={
                  styles.ComicImageWrapper +
                  " " +
                  (comicFade === "in" ? styles.FadeIn : styles.FadeOut)
                }
              >
                <img src={comic} alt="Comic" className={styles.ComicImage} />
                <button
                  className={styles.ComicButton}
                  onClick={() => {
                    setComicFade("out");
                    setTimeout(() => setShowComic(false), 500);
                  }}
                >
                  بریم
                </button>
              </div>
            </div>
          ) : (
            <>
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
                    {renderCongratulationsText(
                      "تبریک میگم شما وارد سیستم اولاد شدید"
                    )}
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
                      <video ref={videoRef} className={styles.Video} muted loop>
                        <source
                          src={"/rakhsh_app/horse_states/voice.mp4"}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}

                  {showForm && (
                    <div className={styles.FormContainer}>
                      <audio ref={audioRef} preload="auto">
                        <source
                          src="/src/pages/khan-6/olad.wav"
                          type="audio/wav"
                        />
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
            </>
          )}
        </div>
      </PageContent>

      {/* Timeout Modal - shows when remaining chances <= 0 */}
      <TimeoutModal
        isOpen={showTimeoutModal}
        onClose={handleTimeoutModalClose}
        timeoutTriggeredAt={timeoutTriggeredAt}
        timeoutAttemptHistory={timeoutAttemptHistory}
        facts={khan6Facts}
        title="سیستم امنیتی قفل شد! ۲ دقیقه صبر کنید تا دوباره فعال شود"
        audioUrl="https://load.filespacer.ir/music/B/Bikalam.Aroom/Loreena.McKennitt.Tango.To.Evora.%5Bsongha.ir%5D.mp3"
      />
    </Page>
  );
};

