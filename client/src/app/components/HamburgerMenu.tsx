"use client"

import { Button } from "@/components/Buttons";
import styles from "./HamburgerMenu.module.css";

const HamburgerMenu = () => {
  return (
    <Button
      variant="wrapper"
      onClick={() => console.log("click")}
      aria-haspopup="dialog"
      className={styles["button"]}
    >
      <span
        className={`material-symbol--container material-symbols-outlined`.trim()}
        aria-hidden={true}
      >
        menu
      </span>
    </Button>
  );
};

export default HamburgerMenu;