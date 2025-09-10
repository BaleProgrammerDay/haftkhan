import { useEffect, useState, useRef } from "react";
import styles from "./Scratch.module.scss";
import clsx from "clsx";
import { Draggable } from "~/components/Draggable";
import { detectCollision } from "~/utils";
import npc from "./npc.jpg";

interface ScratchState {
  npcTranslateX: number;
  isScratched: boolean;
  isStatic: boolean;
  scratchProgress: number;
  isColliding: boolean;
  collisionStartTime: number | null;
  isPinExploded: boolean;
}

const initialState: ScratchState = {
  npcTranslateX: 0,
  isScratched: false,
  isStatic: false,
  scratchProgress: 0,
  isColliding: false,
  collisionStartTime: null,
  isPinExploded: false,
};

export const Scratch = () => {
  const [state, setState] = useState<ScratchState>(initialState);
  const pinRef = useRef<HTMLDivElement>(null);
  const scratchRef = useRef<HTMLDivElement>(null);

  const password = "1234";
  const scraches = new Array(40).fill(0);

  const handleMoveOnNpc = () => {
    if (state.isStatic) return;
    setState((prev) => ({ ...prev, npcTranslateX: -140 }));
  };

  const handleMoveOutNpc = () => {
    if (state.isStatic) return;
    setState((prev) => ({ ...prev, npcTranslateX: 0 }));
  };

  const handleClickNPC = () => {
    setState((prev) => ({
      ...prev,
      npcTranslateX: -350,
      isStatic: true,
    }));
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!pinRef.current || !scratchRef.current) return;
      const collision = detectCollision(
        pinRef.current.getBoundingClientRect(),
        scratchRef.current.getBoundingClientRect()
      );

      setState((prev) => {
        if (collision && !prev.isColliding) {
          // Collision started
          return {
            ...prev,
            isColliding: true,
            collisionStartTime: Date.now(),
          };
        } else if (!collision && prev.isColliding) {
          // Collision ended
          return {
            ...prev,
            isColliding: false,
            collisionStartTime: null,
            scratchProgress: 0,
          };
        } else if (collision && prev.isColliding && prev.collisionStartTime) {
          // Update progress during collision
          const elapsed = Date.now() - prev.collisionStartTime;
          const progress = Math.min((elapsed / 3000) * 100, 100); // 3 seconds = 100%

          // Trigger scratch animation after 3 seconds
          if (elapsed >= 3000 && !prev.isScratched) {
            // Trigger pin explosion after a short delay
            setTimeout(() => {
              setState((currentState) => ({
                ...currentState,
                isPinExploded: true,
              }));
            }, 500);

            return { ...prev, scratchProgress: progress, isScratched: true };
          }

          return { ...prev, scratchProgress: progress };
        }
        return prev;
      });
    }, 1); // Update every millisecond

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div
        className={styles.NPC}
        onMouseOver={handleMoveOnNpc}
        onMouseOut={handleMoveOutNpc}
        style={{ transform: `translateX(${state.npcTranslateX}px)` }}
        onClick={handleClickNPC}
      >
        <img src={npc} draggable={false} />

        {/* Progress indicator */}
        {state.isColliding && state.scratchProgress > 0 && (
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

        {state.isScratched ? (
          password
        ) : (
          <div
            className={styles.ScratchMe}
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
      </div>

      <Draggable initialPosition={{ x: 20, y: 20 }}>
        <div
          className={clsx(styles.Pin, {
            [styles.PinExploded]: state.isPinExploded,
          })}
          ref={pinRef}
        >
          {state.isPinExploded && (
            <div className={styles.ExplosionEffect}>
              {/* Flash effect */}
              <div className={styles.ExplosionFlash} />

              {/* Pin fragments */}
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className={styles.PinFragment}
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
    </>
  );
};

