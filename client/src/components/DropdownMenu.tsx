import styles from "./DropdownMenu.module.css";
import React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const childArray = React.Children.toArray(props.children);

  return (
    <div className={styles["container"]}>
      <ul>
        {childArray.map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;