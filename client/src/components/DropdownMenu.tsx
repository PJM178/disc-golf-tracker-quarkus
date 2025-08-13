import styles from "./DropdownMenu.module.css";
import React from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
  children: React.ReactNode;
  anchorElement: HTMLElement | null;
  open: boolean;
}

const DropdownMenu = (props: DropdownMenuProps) => {
  if (!props.open || !props.anchorElement) return;

  const childArray = React.Children.toArray(props.children);
  const { top, left, height } = props.anchorElement.getBoundingClientRect();

  return (
    createPortal(
      <div
        className={styles["container"]}
        style={{ top: top + height, left: left }}
      >
        <ul>
          {childArray.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      </div>,
      document.body
    )
  );
};

export default DropdownMenu;