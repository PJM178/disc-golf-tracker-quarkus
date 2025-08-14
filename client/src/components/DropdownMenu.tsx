import styles from "./DropdownMenu.module.css";
import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
  children: React.ReactNode;
  anchorElement: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const currentIndexRef = useRef(0);
  const { onClose } = props;

  const handleClose = useCallback(() => {
    currentIndexRef.current = 0;
    containerRef.current = null;
    listRef.current = null;
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    console.log(e.key);
    if (e.key.toLowerCase() === "escape") {
      handleClose();
    }

    if (e.key.toLowerCase() === "arrowdown") {
      if (listRef.current) {
        listRef.current.children[currentIndexRef.current].classList.add(styles["active"]);

        if (currentIndexRef.current > 0) {
          listRef.current.children[currentIndexRef.current - 1].classList.remove(styles["active"]);
        }

        if (currentIndexRef.current === 0) {
          listRef.current.children[listRef.current.children.length - 1].classList.remove(styles["active"]);
        }

        if (currentIndexRef.current < listRef.current.children.length - 1) {
          currentIndexRef.current += 1;
        } else {
          currentIndexRef.current = 0;
        }
      }
    } else if (e.key.toLowerCase() === "arrowup") {
      if (listRef.current) {
        listRef.current.children[currentIndexRef.current].classList.remove(styles["active"]);
      }
    }

    if (e.key.toLowerCase() === "enter") {
      if (listRef.current && listRef.current.children[currentIndexRef.current].children[0] instanceof HTMLElement) {
        (listRef.current.children[currentIndexRef.current - 1 < 0 ? 0 : currentIndexRef.current - 1].children[0] as HTMLElement).click();
      }

      handleClose();
    }
  }, [handleClose, currentIndexRef]);

  useEffect(() => {
    if (containerRef.current && props.anchorElement) {
      const { width, left } = containerRef.current.getBoundingClientRect();
      containerRef.current.style.left = (left - width + props.anchorElement.getBoundingClientRect().width) + "px";
    }

    document.getElementById("root")?.setAttribute("inert", "");
    document.body.addEventListener("keydown", handleKeyDown);

    if (!props.open) {
      document.body.removeEventListener("keydown", handleKeyDown);
      document.getElementById("root")?.removeAttribute("inert");
      console.log("here");
    }
    
  }, [props.open, props.anchorElement, handleKeyDown]);

  if (!props.open || !props.anchorElement) return;

  const childArray = React.Children.toArray(props.children);
  const { top, left, height } = props.anchorElement.getBoundingClientRect();

  return (
    createPortal(
      <div
        className={styles["backdrop"]}
      >
        <div
          className={styles["container"]}
          style={{ top: top + height, left: left }}
          ref={containerRef}
        >
          <ul
            role="menu"
            className={styles["list-container"]}
            ref={listRef}
          >
            {childArray.map((child, index) => (
              <li
                key={index}
                role="menuitem"
                className={styles["list-item"]}
                onClick={props.onClose}
              >
                {child}
              </li>
            ))}
          </ul>
        </div>
        <div
          className={styles["backdrop--click"]}
          onClick={props.onClose}
        />
      </div>,
      document.body
    )
  );
};

export default DropdownMenu;