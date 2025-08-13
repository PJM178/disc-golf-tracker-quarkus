"use client"

import { Button } from "@/components/Buttons";
import styles from "./HamburgerMenu.module.css";
import { useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";

const HamburgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleDropdownMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  return (
    <div
      className={styles["container"]}
    >
      <Button
        variant="wrapper"
        onClick={handleDropdownMenu}
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
      {isMenuOpen &&
        <DropdownMenu>
          <div>
            <div>
              menu item 1
            </div>
          </div>
          <div>
            menu item 2
          </div>
        </DropdownMenu>}
    </div>
  );
};

export default HamburgerMenu;