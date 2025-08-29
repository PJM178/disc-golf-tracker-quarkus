import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./SearchDropdownMenu.module.css";

interface SearchDropdownMenuProps {
  children: React.ReactNode;
  anchorElement: HTMLElement | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchDropdownMenu = (props: SearchDropdownMenuProps) => {
  const { children, anchorElement, setSelectedIndex, isOpen, setIsOpen } = props;
  const containerRef = useRef<HTMLUListElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; height: number; width: number } | null>(null);
  const childArray = useMemo(() => React.Children.toArray(children), [children]);

  const handleSelectValue = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(false);
  };

  useEffect(() => {
    if (anchorElement) {
      const { top, left, height, width } = anchorElement.getBoundingClientRect();
      setRect({ top, left, height, width });
    }
  }, [anchorElement]);

  const handleClickEvent = useCallback((e: PointerEvent) => {
    if (e.target === anchorElement || e.target === containerRef.current) return;

    setIsOpen(false);
  }, [anchorElement, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickEvent);
    } else {
      document.removeEventListener("click", handleClickEvent);
    }
  }, [isOpen, handleClickEvent]);

  return (
    <div
      className={styles["container"]}
    >
      {childArray.length > 0 && rect && isOpen &&
        <ul
          ref={containerRef}
          className={styles["list--container"]}
          style={{ top: (rect.top + rect.height) + "px", width: rect.width + "px" }}
        >
          {childArray.map((child, i) => (
            <li
              key={i}
              className={styles["list--item"]}
              onClick={() => handleSelectValue(i)}
            >
              {child}
            </li>
          ))}
        </ul>}
    </div>
  );
};

export default SearchDropdownMenu;