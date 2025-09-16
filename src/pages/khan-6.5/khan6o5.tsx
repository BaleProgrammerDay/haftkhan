import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { PageProps } from "~/types";
import styles from "./Khan6o5.module.scss";
import { useState, useEffect } from "react";

import xp from "./xp.webp";
import wallpaper from "./wallpaper.jpg";
import { Folder } from "~/components";
import { userActions } from "~/store/user/slice";
import { useDispatch } from "react-redux";

import bale from "./bale.webp";

export const Khan6o5 = (_props: PageProps) => {
  const [count, setCount] = useState<number[]>([]);
  const [enterStatus, setEnterStatus] = useState<"checking" | "entered">(
    "checking"
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (enterStatus === "checking") {
      const interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount.length > 24) {
            setEnterStatus("entered");
            clearInterval(interval);
            return prevCount;
          }
          const newArray = [...prevCount, 1];
          return newArray;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [enterStatus]);

  const handleFolderOpen = () => {
    dispatch(userActions.setLastSolvedQuestion(6));
  };

  return (
    <Page>
      <PageContent>
        {enterStatus === "checking" && (
          <>
            <div className={styles.WindowsXP}>
              <img src={xp} />
            </div>

            <div className={styles.ProgressbarContainer}>
              <p>بزا ببینم رمز درسته؟</p>
              <div className={styles.Progressbar}>
                {count?.map((_, index) => (
                  <div className={styles.Particle} key={index} />
                ))}
              </div>
            </div>
          </>
        )}
        {enterStatus === "entered" && (
          <div className={styles.WindowsXP}>
            <img src={wallpaper} />

            <Folder
              title="بله"
              folderImage={bale}
              onDoubleClick={handleFolderOpen}
              className={styles.Folder}
              imageClassName={styles.FolderImage}
              initialPosition={{ x: 120, y: 20 }}
            />
          </div>
        )}
      </PageContent>
    </Page>
  );
};

