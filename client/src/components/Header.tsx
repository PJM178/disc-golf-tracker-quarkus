import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles["container"]}>
      <div>
        Frisbeegolf-päiväkirja
      </div>
    </header>
  );
};

export default Header;