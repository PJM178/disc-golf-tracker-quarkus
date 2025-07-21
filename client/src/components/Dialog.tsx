import { createPortal } from "react-dom";
import styles from "./Dialog.module.css";
import { useEffect, useRef } from "react";

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  containerClassname?: string;
}

// TODO: could have internal state here to control the rendering of the Dialog in order
// to have transitions finish always but it's also possible that it's better that 
// in certain cases it closes instantly but this could also be controlled internally
const Dialog = (props: DialogProps) => {
  const { children, isOpen, closeModal, containerClassname } = props;
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogContainerRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    if (backdropRef.current && dialogContainerRef.current) {
      backdropRef.current.style.opacity = "0";
      dialogContainerRef.current.style.opacity = "0";
    }
  }

  const handleOnTransitionEnd = () => {
    closeModal();
  };

  // Make root element inert - this element is outside of it in body - for accessibility to, e.g., making elements in root
  // not focusable by tabbing 
  useEffect(() => {
    const element = document.getElementById("root");

    if (isOpen) {
      element?.setAttribute("inert", "true");
    } else {
      element?.removeAttribute("inert");
    }

    return () => {
      const element = document.getElementById("root");
      element?.removeAttribute("inert");
    };
  }, [isOpen]);

  // Add event listener to close the Dialog on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Capture the focus on open for assistive technologies
    if (dialogContainerRef.current) {
      dialogContainerRef.current.focus();
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  if (isOpen) {
    return createPortal(
      <div className={styles["container"]}>
        <div
          ref={backdropRef}
          className={styles["backdrop"]}
          onClick={handleCloseModal}
          onTransitionEnd={handleOnTransitionEnd}
          onKeyDown={(e) => console.log(e)}
        />
        <div
          ref={dialogContainerRef}
          className={`${styles["dialog-content--container"]} ${containerClassname ?? ""}`.trim()}
          tabIndex={0}
        >
          <div className={styles["dialog-content--content"]}>
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
};

export default Dialog;