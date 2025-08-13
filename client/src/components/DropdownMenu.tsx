import styles from "./DropdownMenu.module.css";

const DropdownMenu = () => {
  return (
    <div className={styles["container"]}>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
      </ul>
    </div>
  );
};

export default DropdownMenu;