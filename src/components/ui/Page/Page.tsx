import styles from "./Page.module.scss";
import { FC } from "react";
import clsx from "clsx";

export interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export interface PageContentProps {
  children: React.ReactNode;
}

export const Page: FC<PageProps> = (props) => {
  return (
    <div className={clsx(styles.Page, props.className)}>{props.children}</div>
  );
};

export const PageContent: FC<PageContentProps> = (props) => {
  return <div className={styles.Content}>{props.children}</div>;
};

