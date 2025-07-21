import styles from "./PaneSelector.module.css";
import { CurrentPaneType } from "./Content";
import { Button } from "./Buttons";

interface PaneSelectorProps {
  setCurrentPane: (currentPane: CurrentPaneType) => void;
  currentPane: CurrentPaneType;
}

const PaneSelector = (props: PaneSelectorProps) => {
  return (
    <nav className={styles["pane-selector--container"]}>
      <Button
        variant="wrapper"
        className={`${styles["pane-selector--button"]}`.trim()}
        onClick={() => props.setCurrentPane("home")}
      >
        <div
          className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "home" ? "selected" : ""}`.trim()}
        >
          <span
            className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}
            aria-hidden={true}
          >
            home
          </span>
          <span>
            Nykyinen
          </span>
        </div>
      </Button>
      <Button
        variant="wrapper"
        className={`${styles["pane-selector--button"]}`.trim()}
        onClick={() => props.setCurrentPane("history")}
      >
        <div
          className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "history" ? "selected" : ""}`.trim()}
        >
          <span
            className={`material-symbol--container material-symbols-outlined`.trim()}
            aria-hidden={true}
          >
            history
          </span>
          <span>
            Historia
          </span>
        </div>
      </Button>
    </nav >
  );
};

export default PaneSelector;