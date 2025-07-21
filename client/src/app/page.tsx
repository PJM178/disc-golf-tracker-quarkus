import styles from "./page.module.css";
import Content from "@/components/Content";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <Content />
    </main>
  );
};