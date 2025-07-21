import { Game, Hole, Player } from "@/context/GameStateContext";
import styles from "./PlayerScoreGrid.module.css"
import { Button } from "./Buttons";

interface BasePlayerScoreGridProps {
  scores: Game["players"];
  historical?: boolean;
}

interface PlayerScoreGridWithButtons extends BasePlayerScoreGridProps, Hole {
  hasButtons: true;
  handleHolePlayerScore: (dir: "inc" | "dec", holeId: string, playerId: string) => void;
}

interface PlayerScoreGridWithoutButtons extends BasePlayerScoreGridProps {
  hasButtons: false;
  leadingPlayer: Player;
}

export type PlayerScoreGridProps = PlayerScoreGridWithButtons | PlayerScoreGridWithoutButtons;

const PlayerScoreGrid = (props: PlayerScoreGridProps) => {
  return (
    <div
      className={styles["running-game--hole-players--container"]}
    >
      <div className={styles["running-game--hole-players--grid-header"]}>
        <div>Pelaaja</div>
        <div>pisteet</div>
        <div />
      </div>
      {props.scores.map((p) => (
        <div key={p.id} className={styles["running-game--hole-players--player"]}>
          <div className={styles["running-game--hole-players--player--name"]}>{p.name}</div>
          <div className={styles["running-game--hole-players--player--score"]}>{p.totalScore}</div>
          <div className={styles["running-game--hole-players--buttons--container"]}>
            {props.hasButtons ?
              <>
                <Button
                  onClick={!props.historical ? !props.isActive ? undefined : () => props.handleHolePlayerScore("inc", props.id, p.id) : undefined}
                  variant="wrapper"
                  disabled={props.historical ? true : (props.isActive ? false : true)}
                  style={{ borderRadius: "50%" }}
                  aria-label={`Lisää pelaajan ${p.name} pisteitä`}
                >
                  <div
                    className={`${styles["running-game--hole-players--buttons--button"]} ${props.historical ? styles["disabled"] : ""}`.trim()}
                  >

                    <span
                      className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}
                      aria-hidden={true}
                    >
                      arrow_circle_up
                    </span>
                  </div>
                </Button>
                <Button
                  variant="wrapper"
                  onClick={!props.historical ? !props.isActive ? undefined : p.totalScore === 0 ? undefined : () => props.handleHolePlayerScore("dec", props.id, p.id) : undefined}
                  disabled={props.historical ? true : (props.isActive ? false : true) || p.totalScore === 0}
                  style={{ borderRadius: "50%" }}
                  aria-label={`Vähennä pelaajan ${p.name} pisteitä`}
                >
                  <div
                    className={`${styles["running-game--hole-players--buttons--button"]} ${p.totalScore === 0 || props.historical ? styles["disabled"] : ""}`.trim()}
                  >
                    <span
                      className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}
                      aria-hidden={true}
                    >
                      arrow_circle_down
                    </span>
                  </div>
                </Button>
              </> : props.leadingPlayer.id === p.id &&
              <div
                className={styles["running-game--hole-players--leading-player--container"]}
              >
                <span
                  className={styles["running-game--hole-players--leading-player"]}
                >
                  {props.historical ? "Voitti" : "Johtaa"}
                </span>
              </div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerScoreGrid;