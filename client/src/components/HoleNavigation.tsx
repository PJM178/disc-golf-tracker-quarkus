import { Hole } from "@/context/GameStateContext";
import { Button } from "./Buttons";
import styles from "./HoleNavigation.module.css";
import { memo } from "react";

interface HoleNavigationProps {
  scrollFromButton: React.RefObject<boolean>;
  currentHoleIndex: number;
  setCurrentHoleIndex: React.Dispatch<React.SetStateAction<number>>;
  currentGameHoleList: Hole[];
}

const HoleNavigation = (props: HoleNavigationProps) => {
  const { scrollFromButton, currentHoleIndex, setCurrentHoleIndex, currentGameHoleList } = props;

  const handleScrollNextHole = () => {
    if (currentHoleIndex + 1 < currentGameHoleList.length) {
      scrollFromButton.current = true;

      setCurrentHoleIndex(currentHoleIndex + 1);

    }
  };

  const handleScrollPreviousHole = () => {
    if (currentHoleIndex !== 0) {
      scrollFromButton.current = true;

      setCurrentHoleIndex(currentHoleIndex - 1);
    }
  };

  const handleHoleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    scrollFromButton.current = true;

    const selectedOption = e.target.options[e.target.selectedIndex];
    const index = selectedOption.dataset.index;

    if (index) {
      setCurrentHoleIndex(+index);
    }
  };

  const handleButtonsDisabled = (button: "next" | "previous") => {
    if (currentGameHoleList.length === 1) {
      return true;
    }

    if (button === "next" && currentHoleIndex === currentGameHoleList.length - 1) {
      return true;
    }

    if (button === "previous" && !currentHoleIndex) {
      return true;
    }

    return false;
  };

  return (
    <div className={styles["running-game--hole-list--nav-buttons"]}>
      <Button
        variant="secondary"
        onClick={handleScrollPreviousHole}
        disabled={handleButtonsDisabled("previous")}
      >
        <span>Edellinen</span>
      </Button>
      <select
        onChange={handleHoleOptionSelect}
        value={currentGameHoleList[currentHoleIndex].id}
        aria-label="Valitse reikä"
      >
        {currentGameHoleList.map((h, i) => (
          <option
            key={h.id}
            data-index={i}
            value={h.id}
          >
            {h.hole}
          </option>
        ))}
      </select>
      <Button
        variant="secondary"
        onClick={handleScrollNextHole}
        disabled={handleButtonsDisabled("next")}
      >
        <span>Seuraava</span>
      </Button>
    </div>
  );
};

export default memo(HoleNavigation);