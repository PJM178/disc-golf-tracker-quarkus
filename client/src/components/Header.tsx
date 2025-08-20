import HamburgerMenu from "@/app/components/HamburgerMenu";
import styles from "./Header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles["container"]}>

      <div className={styles["header--name"]}>
        <Link
          href="/"
        >
          Frisbeegolf-päiväkirja
        </Link>
      </div>
      <HamburgerMenu />
    </header>
  );
};

export default Header;