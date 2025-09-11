import { useEffect, useState } from "react";
import styles from "./Khan3.module.scss";
import { Draggable } from "~/components/Draggable";
import { Modal } from "~/components/Modal";
// import frozenFolder from "../khan-2/Folder/frozen_folder.png";
import folder from "../khan-2/Folder/folder.png";
import { PageProps } from "~/types";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";

export const Khan3 = (props: PageProps) => {
  const [showIceFolder, setShowIceFolder] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAzhdar, setShowAzhdar] = useState(false);

  const handleFolderDoubleClick = () => {
    setShowModal(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAzhdar(true);
    }, 8000);
  }, []);

  return (
    <Page>
      <PageContent>
        <div className={styles.VideoContainer}>
          {!showAzhdar && (
            <video className={styles.Video} muted autoPlay loop>
              <source
                src={"/rakhsh_app/horse_states/remembering_start.mp4"}
                type="video/mp4"
              />
            </video>
          )}

          {showAzhdar && (
            <video className={styles.Video} muted autoPlay loop>
              <source
                src={"/rakhsh_app/horse_states/remembering_glitch.mp4"}
                type="video/mp4"
              />
            </video>
          )}
          <p className={styles.VideoText}>در حال یادآوری...</p>
        </div>
      </PageContent>

      {/* Ice folder */}
      {showIceFolder && (
        <Draggable
          initialPosition={{ x: 100, y: 100 }}
          className={styles.iceFolder}
        >
          {/* <img src={frozenFolder} alt="Ice Folder" /> */}
          <p className={styles.folderLabel}>یخ‌زده</p>
        </Draggable>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="rakhsh/home/desktop/folder"
      >
        <div className={styles.modalContent}>
          <p>محتوای پوشه</p>
        </div>
      </Modal>
    </Page>
  );
};

