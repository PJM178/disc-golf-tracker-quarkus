"use client"
import { GameHole, RunningGameInfo } from "./CurrentGame";
import styles from "./History.module.css";
import runningGameStyles from "./CurrentGame.module.css";
import { Game, useGameState } from "@/context/GameStateContext";
import HoleNavigation from "./HoleNavigation";
import { useEffect, useRef, useState } from "react";

const NoHistory = () => {
  return (
    <div className={styles["history-list--no-games"]}>
      <i>Ei pelejä</i>
    </div>
  );
};

interface HistoricalGameProps {
  game: Game;
}

const HistoricalGame = (props: HistoricalGameProps) => {
  const { game } = props;
  const holeListRef = useRef<HTMLUListElement>(null);
  const holeListChildrenWidths = useRef<{ width: number, id: string }[]>(null);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const scrollFromButton = useRef<boolean>(false);
  const holeIndexRef = useRef<number>(null);

  const handleDateDisplay = (time: number | null) => {
    if (!time) return "";

    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  };

  // Side effect of currentHoleIndex changes is defined here, scrollFromButton ref is used to prevent
  // onScrollEnd event from affecting this hook
  useEffect(() => {
    if (!scrollFromButton.current && !holeIndexRef.current) return;

    const hole = game.holeList[holeIndexRef.current ?? currentHoleIndex];
    holeIndexRef.current = null;

    if (!hole) return;

    const element = document.getElementById("hole-" + hole.id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentHoleIndex, game.holeList]);

  // Scroll into view the closest child node when the scrolling ends
  const handleULOnScrollEnd = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    if (scrollFromButton.current) {
      scrollFromButton.current = false;

      return;
    }

    const ul = e.target as HTMLElement;
    let endingWidth = ul.scrollLeft;

    if (!holeListChildrenWidths.current) {
      holeListChildrenWidths.current = Array.from(ul.children).map((c) => {
        const el = c as HTMLElement;

        return { width: el.offsetWidth, id: el.id };
      });
    }

    for (let i = 0; i < holeListChildrenWidths.current.length; i++) {
      const currentWidth = holeListChildrenWidths.current[i].width;
      endingWidth -= holeListChildrenWidths.current[i].width;

      if (endingWidth < 0) {
        if (currentHoleIndex > i) {
          if (Math.abs(endingWidth) > currentWidth * 0.3) {
            const element = document.getElementById(holeListChildrenWidths.current[i].id);

            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "nearest" });

              setCurrentHoleIndex(i);

              return;
            }
          }
        }

        if (Math.abs(endingWidth) < currentWidth * 0.7) {
          const element = document.getElementById(holeListChildrenWidths.current[i + 1].id);

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });

            setCurrentHoleIndex(i + 1);

            return;
          }
        }

        const element = document.getElementById(holeListChildrenWidths.current[i].id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });

          setCurrentHoleIndex(i);

          return;
        }
      }
    }
  };

  // Update the holeListChildrenWidths here when currentGame holeList array changes - it's for caching purposes
  useEffect(() => {
    holeListChildrenWidths.current = null;
  }, [game.holeList.length]);


  return (
    <>
      <RunningGameInfo
        gameName={game.name}
        players={game.players}
        historical={true}
        date={handleDateDisplay(game.endTime)}
        location={game.location}
      >
        <div className={runningGameStyles["running-game--hole-list--container"]}>
          <HoleNavigation
            scrollFromButton={scrollFromButton}
            currentHoleIndex={currentHoleIndex}
            setCurrentHoleIndex={setCurrentHoleIndex}
            currentGameHoleList={game.holeList}
          />
          <ul
            className={runningGameStyles["running-game--hole-list"]}
            ref={holeListRef}
            onScrollEnd={handleULOnScrollEnd}
          >
            {game.holeList.map((hole, index) => (
              <GameHole
                key={hole.id}
                index={index}
                {...hole}
                handleHolePlayerScore={() => null}
                handleFinishHole={() => null}
                historical={true}
                holeListLength={game.holeList.length}
              />
            ))}
          </ul>
        </div>
      </RunningGameInfo>
    </>
  );
};

interface HistoryListProps {
  gameHistory: Game[];
}

const HistoryList = (props: HistoryListProps) => {
  return (
    <ul className={styles["history-list--game-list"]}>
      {props.gameHistory.map((game) => (
        <li key={game.id} className={styles["history-list--game-container"]}>
          <HistoricalGame
            game={game}
          />
        </li>
      ))}
    </ul>
  );
};

const History = () => {
  const { gameState } = useGameState();

  return (
    <div className={styles["history-list--container"]}>
      {gameState.history?.length === 0 || !gameState.history ?
        <NoHistory /> :
        <HistoryList gameHistory={gameState.history} />}
    </div>
  );
};

export default History;