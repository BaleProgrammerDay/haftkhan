import { useEffect, useState, useRef } from "react";
import styles from "./Scratch.module.scss";
import clsx from "clsx";
import { Draggable } from "~/components/Draggable";
import { detectCollision } from "~/utils";

import hesamGif from "./assets/h.gif";
import aliGif from "./assets/a.gif";
import amirhosein from "./assets/am.gif";
import yashar from "./assets/y.gif";
import tavakoli from "./assets/t.gif";
import { usernameSelector } from "~/store/user/slice";
import { useSelector } from "react-redux";

import teaImage from "./assets/tea.jpg";
import packetImage from "./assets/packet.jpg";
import scrissorsImage from "./assets/scrissors.jpg";
import calenderImage from "./assets/calender.jpg";
import sangImage from "./assets/sang.jpg";

interface ScratchState {
  npcTranslateX: number;
  isScratched: boolean;
  isStatic: boolean;
  scratchProgress: number;
  isColliding: boolean;
  collisionStartTime: number | null;
  isPinExploded: boolean;
  isFrameDestroyed: boolean;
  isBottomFrameFalling: boolean;
  isImageFalling: boolean;
  isTopFrameBroken: boolean;
  isDraggablePieceCreated: boolean;
  isPieceNearPassword: boolean;
  isPieceExploded: boolean;
  isPasswordRevealed: boolean;
}

const initialState: ScratchState = {
  npcTranslateX: 0,
  isScratched: false,
  isStatic: false,
  scratchProgress: 0,
  isColliding: false,
  collisionStartTime: null,
  isPinExploded: false,
  isFrameDestroyed: false,
  isBottomFrameFalling: false,
  isImageFalling: false,
  isTopFrameBroken: false,
  isDraggablePieceCreated: false,
  isPieceNearPassword: false,
  isPieceExploded: false,
  isPasswordRevealed: false,
};

const ourUsernames = [
  "مامور 001",
  "قهرمان",
  "اکسلنت‌ها",
  "بازگشت اصلان",
  "سه کله پو",
  "هیمالیا",
  "وهوش",
  "موقت: اینت",
  "چای کرک",
  "FourSure",
  "حسین کبیر",
  "پشتیبانی",
  "شواهد",
  "رادمردان عرصه ک",
  "New Folder",
  "فرضی1",
  "فرضی",
  "فرضی2",
];

const getImage = (username: string) => {
  switch (username) {
    case "مامور 001":
      return packetImage;
    case "قهرمان":
      return teaImage;
    case "اکسلنت‌ها":
      return teaImage;
    case "بازگشت اصلان":
      return teaImage;
    case "سه کله پو":
      return packetImage;
    case "هیمالیا":
      return teaImage;
    case "وهوش":
      return sangImage;
    case "موقت: اینت":
      return packetImage;
    case "چای کرک":
      return teaImage;
    case "FourSure":
      return calenderImage;
    case "حسین کبیر":
      return sangImage;
    case "پشتیبانی":
      return packetImage;
    case "شواهد":
      return sangImage;
    case "رادمردان عرصه ک":
      return calenderImage;
    case "New Folder":
      return calenderImage;
    case "سنگر":
      return calenderImage;
    case "فرضی":
      return calenderImage;
    case "فرضی2":
      return tavakoli;
  }
};

const getGif = (username: string) => {
  switch (username) {
    case "مامور 001":
      return hesamGif;
    case "قهرمان":
      return yashar;
    case "اکسلنت‌ها":
      return hesamGif;
    case "بازگشت اصلان":
      return tavakoli;
    case "سه کله پو":
      return aliGif;
    case "هیمالیا":
      return amirhosein;
    case "وهوش":
      return aliGif;
    case "موقت: اینت":
      return yashar;
    case "چای کرک":
      return aliGif;
    case "FourSure":
      return tavakoli;
    case "حسین کبیر":
      return amirhosein;
    case "پشتیبانی":
      return tavakoli;
    case "شواهد":
      return aliGif;
    case "رادمردان عرصه ک":
      return yashar;
    case "New Folder":
      return hesamGif;
    case "سنگر":
      return tavakoli;
    case "فرضی":
      return tavakoli;
    case "فرضی2":
      return tavakoli;
  }
};

export const Scratch = (props: { password: string }) => {
  const [state, setState] = useState<ScratchState>(initialState);
  const pinRef = useRef<HTMLDivElement>(null);
  const scratchRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const topFrameRef = useRef<HTMLDivElement>(null);
  const draggablePieceRef = useRef<HTMLDivElement>(null);
  const passwordAreaRef = useRef<HTMLDivElement>(null);
  const [framePosition, setFramePosition] = useState({ x: 0, y: 0 });

  const username = useSelector(usernameSelector);
  const password = props.password;
  const scraches = new Array(40).fill(0);

  const handleMoveOnNpc = () => {
    if (state.isStatic) return;
    setState((prev) => ({ ...prev, npcTranslateX: -110 }));
  };

  const handleMoveOutNpc = () => {
    if (state.isStatic) return;
    setState((prev) => ({ ...prev, npcTranslateX: 0 }));
  };

  const handleClickNPC = () => {
    if (state.isStatic) return;
    setState((prev) => ({
      ...prev,
      npcTranslateX: -250,
      isStatic: true,
    }));
  };

  const handleTopFrameClick = () => {
    // Always allow breaking (not dependent on image falling)
    if (state.isTopFrameBroken) {
      return;
    }

    if (topFrameRef.current) {
      const rect = topFrameRef.current.getBoundingClientRect();
      setFramePosition({ x: rect.left, y: rect.top });
    }

    setState((prev) => ({
      ...prev,
      isDraggablePieceCreated: true,
      isTopFrameBroken: true,
    }));
  };

  const handleBottomFrameClick = () => {
    if (state.isBottomFrameFalling || state.isImageFalling) {
      return;
    }

    // Start bottom frame falling animation
    setState((prev) => ({
      ...prev,
      isBottomFrameFalling: true,
    }));

    // After 500ms, start image falling animation
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isImageFalling: true,
      }));
    }, 500);
  };

  // Collision detection for pin and scratch overlay
  useEffect(() => {
    const id = setInterval(() => {
      if (!pinRef.current || !scratchRef.current) {
        return;
      }

      const collision = detectCollision(
        pinRef.current.getBoundingClientRect(),
        scratchRef.current.getBoundingClientRect()
      );

      setState((prev) => {
        if (collision && !prev.isColliding) {
          return {
            ...prev,
            isColliding: true,
            collisionStartTime: Date.now(),
          };
        } else if (!collision && prev.isColliding) {
          return {
            ...prev,
            isColliding: false,
            collisionStartTime: null,
            scratchProgress: 0,
          };
        } else if (collision && prev.isColliding && prev.collisionStartTime) {
          const elapsed = Date.now() - prev.collisionStartTime;
          const progress = Math.min((elapsed / 3000) * 100, 100);

          if (elapsed >= 3000 && !prev.isScratched) {
            setTimeout(() => {
              setState((currentState) => ({
                ...currentState,
                isPinExploded: true,
              }));
            }, 500);

            setTimeout(() => {
              setState((currentState) => ({
                ...currentState,
                isFrameDestroyed: true,
              }));
            }, 1000);

            return { ...prev, scratchProgress: progress, isScratched: true };
          }

          return { ...prev, scratchProgress: progress };
        }
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(id);
    };
  }, []);

  // Collision detection for draggable piece and scratch overlay
  useEffect(() => {
    if (!state.isDraggablePieceCreated || state.isPieceExploded) {
      return;
    }

    const id = setInterval(() => {
      if (!draggablePieceRef.current || !scratchRef.current) {
        return;
      }

      const collision = detectCollision(
        draggablePieceRef.current.getBoundingClientRect(),
        scratchRef.current.getBoundingClientRect()
      );

      setState((prev) => {
        // Only allow collision detection after image has fallen
        if (!prev.isImageFalling) {
          return prev;
        }

        if (collision && !prev.isPieceNearPassword) {
          return {
            ...prev,
            isPieceNearPassword: true,
            collisionStartTime: Date.now(),
          };
        } else if (!collision && prev.isPieceNearPassword) {
          return {
            ...prev,
            isPieceNearPassword: false,
            collisionStartTime: null,
          };
        } else if (
          collision &&
          prev.isPieceNearPassword &&
          prev.collisionStartTime
        ) {
          const elapsed = Date.now() - prev.collisionStartTime;
          const progress = Math.min((elapsed / 3000) * 100, 100);

          if (elapsed >= 3000 && !prev.isPieceExploded) {
            // Explode the piece and reveal password
            setState((currentState) => ({
              ...currentState,
              isPieceExploded: true,
              isPasswordRevealed: true,
            }));
          }

          return { ...prev, scratchProgress: progress };
        }
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(id);
    };
  }, [
    state.isDraggablePieceCreated,
    state.isPieceExploded,
    state.isImageFalling,
  ]);

  return (
    <>
      <div
        className={styles.NPC}
        onMouseOver={handleMoveOnNpc}
        onMouseOut={handleMoveOutNpc}
        style={{ transform: `translateX(${state.npcTranslateX}px)` }}
        onClick={handleClickNPC}
      >
        {/* Container for Image and Password with Wooden Frame */}
        <div ref={contentContainerRef} className={styles.ContentContainer}>
          {/* Password Area - revealed when piece explodes */}
          <div
            ref={passwordAreaRef}
            className={clsx(styles.PasswordArea, {
              [styles.Revealed]: state.isPasswordRevealed,
            })}
          >
            {password}
          </div>

          {/* Image layer */}
          {!state.isScratched ? (
            <div
              className={clsx(styles.ImageLayer, {
                [styles.Scratching]: state.scratchProgress >= 100,
                [styles.ImageFalling]: state.isImageFalling,
              })}
            >
              <img src={getGif(username)} draggable={false} />
            </div>
          ) : null}

          {/* Scratch overlay - fixed in center, independent of image */}
          {!state.isPasswordRevealed && (
            <div
              className={styles.ScratchOverlay}
              onClick={handleClickNPC}
              ref={scratchRef}
            >
              {scraches.map((_, index) => (
                <div
                  className={clsx(styles.ScratchLine, {
                    [styles.Odd]: index % 2 === 1,
                  })}
                  key={index}
                />
              ))}
            </div>
          )}

          {/* Wooden Frame around the entire container */}
          {!state.isFrameDestroyed && (
            <div
              className={clsx(styles.WoodenFrame, {
                [styles.Destroying]:
                  state.isScratched && !state.isFrameDestroyed,
              })}
            >
              {/* Top Frame Part - Always clickable */}
              {!state.isTopFrameBroken ? (
                <div
                  ref={topFrameRef}
                  className={clsx(
                    styles.FramePart,
                    styles.TopFrame,
                    styles.ClickableFrame
                  )}
                  onClick={handleTopFrameClick}
                />
              ) : (
                <div
                  className={clsx(
                    styles.FramePart,
                    styles.TopFrame,
                    styles.BrokenFrame
                  )}
                />
              )}

              {/* Left Frame Part */}
              <div className={clsx(styles.FramePart, styles.LeftFrame)} />

              {/* Right Frame Part */}
              <div className={clsx(styles.FramePart, styles.RightFrame)} />

              {/* Bottom Frame Part - Clickable to trigger falling animation */}
              <div
                className={clsx(
                  styles.FramePart,
                  styles.BottomFrame,
                  styles.ClickableFrame,
                  {
                    [styles.Falling]: state.isBottomFrameFalling,
                  }
                )}
                onClick={handleBottomFrameClick}
              />
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {((state.isColliding && state.scratchProgress > 0) ||
          (state.isPieceNearPassword && state.scratchProgress > 0)) && (
          <div className={styles.ProgressContainer}>
            <div className={styles.ProgressBar}>
              <div
                className={styles.ProgressFill}
                style={{
                  transform: `scaleX(${state.scratchProgress / 100})`,
                }}
              />
            </div>
            <div className={styles.ProgressText}>
              {Math.round(state.scratchProgress)}%
            </div>
          </div>
        )}
      </div>

      {/* Draggable Wooden Frame Piece - broken off from top frame */}
      {state.isDraggablePieceCreated && (
        <Draggable initialPosition={framePosition}>
          <div
            ref={draggablePieceRef}
            className={clsx(styles.DraggableFramePiece, {
              [styles.FramePieceExploded]: state.isPieceExploded,
              [styles.PieceNearPassword]: state.isPieceNearPassword,
            })}
          >
            {state.isPieceExploded && (
              <div className={styles.ExplosionEffect}>
                {/* Flash effect */}
                <div className={styles.ExplosionFlash} />

                {/* Frame piece fragments */}
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className={styles.FramePieceFragment}
                    style={
                      {
                        "--fragment-index": index,
                        "--total-fragments": 6,
                      } as React.CSSProperties
                    }
                  />
                ))}

                {/* Debris particles */}
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={`debris-${index}`}
                    className={styles.DebrisParticle}
                    style={
                      {
                        "--particle-index": index,
                        "--total-particles": 8,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </Draggable>
      )}
    </>
  );
};

