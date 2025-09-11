import styles from "./Page.module.scss";
import { FC } from "react";

export interface PageProps {
  children: React.ReactNode;
}

export interface PageContentProps {
  children: React.ReactNode;
}

export const Page: FC<PageProps> = (props) => {
  return <div className={styles.Page}>{props.children}</div>;
};

export const PageContent: FC<PageContentProps> = (props) => {
  return <div className={styles.Content}>{props.children}</div>;
};

