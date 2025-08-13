import HamburgerMenu from "@/app/components/HamburgerMenu";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles["container"]}>
      <div  className={styles["header--name"]}>
        Frisbeegolf-päiväkirja
      </div>
      <HamburgerMenu />
    </header>
  );
};

export default Header;