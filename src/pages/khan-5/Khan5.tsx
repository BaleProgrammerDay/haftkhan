import { useEffect, useState } from "react";
import styles from "./Khan5.module.scss";
import { Folder } from "~/components/Folder";
import { PageProps } from "~/types";
import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";

import folderIcon from "~/assets/folder.png";

export const Khan5 = (_props: PageProps) => {
  const [showGuido, setShowGuido] = useState(true);
  const [openableFolderIndex] = useState(15); // Folder 15 can be opened
  const [openFolders, setOpenFolders] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // Show guido video immediately
    setShowGuido(true);
  }, []);

  // Generate folder data for 30 folders
  const folders = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    title: `پوشه ${index + 1}`,
    isOpenable: index === openableFolderIndex,
    initialPosition: {
      x: 50 + (index % 6) * 120, // 6 folders per row
      y: 100 + Math.floor(index / 6) * 100, // New row every 6 folders
    },
  }));

  const handleFolderDoubleClick = (folderId: number) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder?.isOpenable) {
      // Show error or feedback for non-openable folders
      console.log(`Folder ${folderId + 1} cannot be opened`);
      return;
    }
    // Handle opening the special folder
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: true
    }));
    console.log(`Opening folder ${folderId + 1}`);
  };

  const renderFolderContent = (folderId: number) => {
    if (folderId === openableFolderIndex) {
      return (
        <div className={styles.FolderContent}>
          <h3>محتویات پوشه ویژه</h3>
          <p>این تنها پوشه‌ای است که می‌تواند باز شود!</p>
          <div className={styles.FileList}>
            <div className={styles.File}>📄 فایل مهم.txt</div>
            <div className={styles.File}>📄 اسناد محرمانه.pdf</div>
            <div className={styles.File}>📁 پوشه فرعی</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Page>
      <PageContent>
        <div className={styles.VideoContainer}>
          {showGuido && (
            <video className={styles.Video} muted autoPlay loop>
              <source
                src={"/rakhsh_app/horse_states/guido.mp4"}
                type="video/mp4"
              />
            </video>
          )}
          <p className={styles.VideoText}>گیدو در حال کار...</p>
        </div>

        <div className={styles.FoldersContainer}>
          {folders.map((folder) => (
            <Folder
              key={folder.id}
              title={folder.title}
              initialPosition={folder.initialPosition}
              folderImage={folderIcon}
              onDoubleClick={() => handleFolderDoubleClick(folder.id)}
              className={styles.FolderItem}
              path={`rakhsh/home/desktop/${folder.title}`}
              isOpen={openFolders[folder.id] || false}
              onClose={() => setOpenFolders(prev => ({
                ...prev,
                [folder.id]: false
              }))}
            >
              {renderFolderContent(folder.id)}
            </Folder>
          ))}
        </div>
      </PageContent>
    </Page>
  );
};
