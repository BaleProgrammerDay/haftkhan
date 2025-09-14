import { Page } from "~/components/ui";
import { PageContent } from "~/components/ui/Page/Page";
import { PageProps } from "~/types";
import styles from "./Khan6o5.module.scss";

export const Khan6o5 = (_props: PageProps) => {
  return (
    <Page>
      <PageContent>
        <div className={styles.Container}>
          <div className={styles.CongratulationsText}>
            تبریک میگم شما وارد سیستم اولاد شدید
          </div>
        </div>
      </PageContent>
    </Page>
  );
};