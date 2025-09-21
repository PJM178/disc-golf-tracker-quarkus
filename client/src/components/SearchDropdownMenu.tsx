import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./SearchDropdownMenu.module.css";
import { NAVIGATION_KEYS } from "@/utils/utilities";

interface SearchDropdownMenuProps {
  children: React.ReactNode;
  anchorElement: HTMLElement | null;
  listRef?: React.RefObject<HTMLUListElement | null>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<string | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ulClass?: string;
  liClass?: string;
}

interface ItemProps {
  id?: string;
  callback?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function isDropdownItem(child: React.ReactNode): child is React.ReactElement<ItemProps> {
  return React.isValidElement(child) && child.type === Item;
}

const Item = ({ children }: ItemProps) => <>{children}</>;

const SearchDropdownMenu = (props: SearchDropdownMenuProps) => {
  const { children, anchorElement, setSelectedIndex, isOpen, setIsOpen, liClass, ulClass } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemIndexRef = useRef<number>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; height: number; width: number } | null>(null);

  const handleClickElement = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, value?: string, callback?: () => void) => {
    setSelectedIndex(value || "");

    if (callback) {
      callback();

      return;
    }

    setIsOpen(false);
  };

  const { items, filteredItems } = useMemo(() => {
    const items: { id?: string; callback?: () => void; disabled?: boolean; className?: string; element: React.ReactNode }[] = [];

    React.Children.forEach(children, (child) => {
      if (isDropdownItem(child)) {
        items.push({
          id: child.props.id, callback: child.props.callback, disabled: child.props.disabled, element: child.props.children,
          className: child.props.className,
        });
      }
    });

    const filteredItems = items.filter((i) => !i.disabled);

    return { items, filteredItems };
  }, [children]);

  useEffect(() => {
    if (anchorElement) {
      const { top, left, height, width } = anchorElement.getBoundingClientRect();
      setRect({ top, left, height, width });
    }
  }, [anchorElement]);

  const handleClickEvent = useCallback((e: PointerEvent) => {
    if (e.target === anchorElement || document.activeElement === anchorElement) return;

    if (containerRef.current?.contains(e.target as HTMLElement)) return;

    setIsOpen(false);
  }, [anchorElement, setIsOpen]);

  const handleKeydownEvent = useCallback((e: KeyboardEvent) => {
    if (NAVIGATION_KEYS.has(e.key)) {
      if (!ulRef.current) return;

      const childList = ulRef.current.children;

      if (e.key === "ArrowDown") {
        if (selectedItemIndexRef.current === null || selectedItemIndexRef.current === filteredItems.length - 1) {
          selectedItemIndexRef.current = 0;
        } else {
          selectedItemIndexRef.current += 1;
        }

        if (selectedItemIndexRef.current !== null) {
          if (selectedItemIndexRef.current === 0) {
            childList[filteredItems.length - 1].classList.remove(styles["active"]);
          } else {
            childList[selectedItemIndexRef.current - 1].classList.remove(styles["active"]);
          }
        }

        childList[selectedItemIndexRef.current].classList.add(styles["active"]);
      } else if (e.key === "ArrowUp") {
        if (selectedItemIndexRef.current === null || selectedItemIndexRef.current === 0) {
          selectedItemIndexRef.current = filteredItems.length - 1;
        } else {
          selectedItemIndexRef.current -= 1;
        }

        if (selectedItemIndexRef.current !== null) {
          if (selectedItemIndexRef.current === filteredItems.length - 1) {
            childList[0].classList.remove(styles["active"]);
          } else {
            childList[selectedItemIndexRef.current + 1].classList.remove(styles["active"]);
          }
        }

        childList[selectedItemIndexRef.current].classList.add(styles["active"]);
      }
    }
  }, [filteredItems]);

  useEffect(() => {
    if (isOpen) {
      // Click event for closing the dropdown menu
      document.addEventListener("click", handleClickEvent);

      // Keyboard event for menu navigation
      document.addEventListener("keydown", handleKeydownEvent);
    } else {
      document.removeEventListener("click", handleClickEvent);
      document.removeEventListener("keydown", handleKeydownEvent);
    }

    return () => {
      document.removeEventListener("click", handleClickEvent);
      document.removeEventListener("keydown", handleKeydownEvent);
    };
  }, [isOpen, handleClickEvent, handleKeydownEvent]);

  return (
    <div
      className={styles["container"]}
      ref={containerRef}
    >
      {items.length > 0 && rect && isOpen &&
        <ul
          className={`${styles["list--container"]} ${ulClass ? ulClass : ""}`.trim()}
          style={{ top: (rect.top + rect.height) + "px", width: rect.width + "px" }}
          ref={(el) => {
            if (props.listRef) {
              props.listRef.current = el;
            }

            ulRef.current = el;
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              className={`${styles["list--item"]} ${liClass ? liClass : ""} ${item.disabled ? styles["list--item-disabled"] : ""} ${item.className ?? ""}`.trim()}
              onClick={(e) => handleClickElement(e, item.id, item.callback)}
              data-ignore={item.callback ? true : false}
            >
              {item.element}
            </li>
          ))}
        </ul>}
    </div>
  );
};

SearchDropdownMenu.Item = Item;

export default SearchDropdownMenu;