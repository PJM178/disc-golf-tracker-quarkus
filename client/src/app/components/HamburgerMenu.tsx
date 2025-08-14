"use client"

import { Button } from "@/components/Buttons";
import styles from "./HamburgerMenu.module.css";
import { useCallback, useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import Link from "next/link";

const HamburgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleDropdownMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsMenuOpen(!isMenuOpen);

    if (!isMenuOpen) {
      setAnchorEl(e.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleCloseDropdownMenu = useCallback(() => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  }, []);

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
      <DropdownMenu
        anchorElement={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseDropdownMenu}
      >
        <Link href="/dashboard">
          <div
            className={styles["list-item"]}
          >
            <span
              className={`material-symbol--container material-symbols-outlined`.trim()}
              aria-hidden={true}
            >
              account_circle
            </span>
            <span>Tili</span>
          </div>
        </Link>
        <Link href="/">
          <div
            className={styles["list-item"]}
          >
            <span
              className={`material-symbol--container material-symbols-outlined`.trim()}
              aria-hidden={true}
            >
              account_circle
            </span>
            <span>Koti</span>
          </div>
        </Link>
        <div className={styles["list-item"]}>
          asd
          </div>
          1
      </DropdownMenu>
    </div>
  );
};

export default HamburgerMenu;