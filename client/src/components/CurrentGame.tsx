"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CurrentGame.module.css"
import Dialog from "./Dialog";
import { Button, Switch } from "./Buttons";
import { ProgressActivity } from "./Loading";
import { Game, GameState, useGameState, Hole, Player } from "@/context/GameStateContext";
import { generateRandomId } from "@/utils/utilities";
import PlayerScoreGrid from "./PlayerScoreGrid";
import HoleNavigation from "./HoleNavigation";
import TextField from "./Inputs";
import { AnchorWrapper } from "./Wrappers";

type NewGameType = Omit<Game, "startTime" | "endTime" | "currentHole">;

interface AddPlayerInputProps {
  index: number;
  playerId: string;
  setNewGameProps: React.Dispatch<React.SetStateAction<NewGameType>>;
  playerName: string;
}

const AddPlayerInput = memo(function AddPlayerInput(props: AddPlayerInputProps) {
  const handleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setNewGameProps((prevValue) => ({
      ...prevValue,
      players: prevValue.players.map((player) =>
        player.id === props.playerId
          ? { ...player, name: e.target.value }
          : player
      ),
    }));
  };

  const handleRemovePlayer = () => {
    props.setNewGameProps((prevValue) => ({
      ...prevValue,
      players: prevValue.players.filter((player) => player.id !== props.playerId),
    }));
  };

  return (
    <div className={styles["new-game-form--form--players-input"]}>
      <TextField
        variant="outlined"
        onChange={handleInputChangeEvent}
        value={props.playerName}
        id={props.playerId}
      />
      {props.index !== 0 ?
        <Button
          onClick={handleRemovePlayer}
          variant="wrapper"
          type="button"
        >
          <div
            className={styles["new-game-form--form--players-remove-icon"]}
          >
            <span
              className={`material-symbol--container material-symbols-outlined`.trim()}
              aria-hidden={true}
            >
              person_remove
            </span>
          </div>
        </Button> :
        <div
          className={styles["new-game-form--form--players-remove-icon"]}
        >
          <span
            className={`material-symbol--container material-symbols-outlined`.trim()}
            aria-hidden={true}
          />
        </div>}
    </div>
  );
});

interface NewGameFormProps {
  closeDialog: () => void;
}

const NewGameForm = (props: NewGameFormProps) => {
  const [newGameProps, setNewGameProps] = useState<NewGameType>({
    name: "Uusi peli",
    holes: 1,
    players: [{ name: "", id: generateRandomId(), totalScore: 0 }],
    location: null,
    id: generateRandomId(),
    holeList: [],
  });
  // location as its own state as it being async operation, updating newGameProps can result in stale state
  const [location, setLocation] = useState<Game["location"]>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { setGameState, metaData, setMetaData } = useGameState();

  const handleGameName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGameProps({ ...newGameProps, name: e.target.value });
  };

  const handleGameHoles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) < 0) {
      setNewGameProps({ ...newGameProps, holes: 1 });
    } else if (e.target.value.length === 0) {
      setNewGameProps({ ...newGameProps, holes: "" });
    } else {
      setNewGameProps({ ...newGameProps, holes: +e.target.value });
    }
  };

  const handleGameHolesBlur = () => {
    if (!newGameProps.holes) {
      setNewGameProps({ ...newGameProps, holes: 1 })
    }
  };

  const handleAddPlayer = () => {
    setNewGameProps((prevValue) => ({
      ...prevValue,
      players: [
        ...prevValue.players,
        { name: "", id: generateRandomId(), totalScore: 0 }
      ]
    }));
  };

  // When adding new players focus the input field
  // If the field already has value, don't focus it, so in the cases when deleting players
  useEffect(() => {
    if (newGameProps.players.length > 1) {
      const element = document.getElementById(newGameProps.players[newGameProps.players.length - 1].id) as HTMLInputElement;

      if (element) {
        if (!element.value) {
          element.focus();
        }
      }
    }
  }, [newGameProps.players]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const populateHoles = Array.from({ length: Number(newGameProps.holes) || 1 }, (_, i) => {
      const hole: Hole = { hole: i + 1, scores: [...newGameProps.players], id: generateRandomId(), isActive: true };

      return hole;
    });

    setGameState((prevValue) => {
      const clonedValue = { ...prevValue };

      clonedValue.currentGame = {
        id: newGameProps.id,
        name: newGameProps.name,
        players: newGameProps.players,
        location: location,
        holes: newGameProps.holes || 1,
        holeList: populateHoles,
        currentHole: populateHoles[0].id,
        startTime: new Date().getTime(),
        endTime: null,
      }

      return clonedValue;
    });

    props.closeDialog();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).tagName === "INPUT") {
      e.preventDefault();
    }
  };

  const getCurrentPositionAsync = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos), (err) => reject(err));
    });
  };

  const handleLocation = async () => {
    if (!metaData || metaData.permissions.geolocation === "denied") {
      return;
    }

    if (location) {
      setLocation(null);

      return;
    }

    if (metaData.permissions.geolocation === "granted") {
      setIsLoadingLocation(true);

      try {
        const result = await getCurrentPositionAsync();
        setLocation({ latitude: result.coords.latitude, longitude: result.coords.longitude });
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          console.error("Error prompting user: ", err.message);
        }
      } finally {
        setIsLoadingLocation(false);

        return;
      }
    }

    if (metaData.permissions.geolocation === "prompt") {
      setIsLoadingLocation(true);

      try {
        const result = await getCurrentPositionAsync();

        setLocation({ latitude: result.coords.latitude, longitude: result.coords.longitude });
      } catch (err) {
        setMetaData((prevValue) => {
          if (prevValue) {
            prevValue.permissions.geolocation = "denied";

            return { ...prevValue };
          }

          return prevValue;
        });

        if (err instanceof GeolocationPositionError) {
          console.error("Error prompting user: ", err.message);
        }
      } finally {
        setIsLoadingLocation(false);

        return;
      }
    }
  }

  return (
    <div className={styles["new-game-form--container"]}>
      <div className={styles["new-game-form--title"]}>
        <div>Uusi peli</div>
        <Button
          onClick={props.closeDialog}
          variant="wrapper"
          type="button"
          style={{ marginLeft: "auto" }}
        >
          <div
            className={styles["new-game-form--title-symbol--container"]}
          >
            <div
              className={`material-symbol--container material-symbols-outlined`.trim()}
              aria-hidden={true}
            >
              close
            </div>
          </div>
        </Button>
      </div>
      <form
        className={styles["new-game-form--form--container"]}
        onSubmit={handleFormSubmit}
        onKeyDown={handleKeyDown}
      >
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-name">Nimi</label>
          <TextField
            variant="outlined"
            name="new-game-name"
            id="new-game-name"
            onChange={handleGameName}
            value={newGameProps.name}
          />
        </div>
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-holes">Reiät</label>
          <TextField
            variant="outlined"
            name="new-game-holes"
            id="new-game-holes"
            onChange={handleGameHoles}
            value={newGameProps.holes}
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            pattern="[0-9]*"
            onBlur={handleGameHolesBlur}
            placeholder="Valitse "
          />
        </div>
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-players">Pelaajat</label>
          <div id="new-game-players" className={styles["new-game-form--form--players-container"]}>
            {newGameProps.players.map((p, i) => (
              <AddPlayerInput
                key={p.id}
                index={i}
                setNewGameProps={setNewGameProps}
                playerId={p.id}
                playerName={p.name}
              />
            ))}
          </div>
          <Button
            variant="wrapper"
            onClick={handleAddPlayer}
            type="button"
          >
            <div className={styles["new-game-form--form--add-players"]}>
              <span>Lisää pelaaja</span>
              <div className={styles["new-game-form--form--players-remove-icon"]}>
                <span
                  className={`material-symbol--container material-symbols-outlined`.trim()}
                  aria-hidden={true}
                >
                  person_add
                </span>
              </div>
            </div>
          </Button>
        </div>
        <div className={styles["new-game-form--form--input-field-row"]}>
          <label>Tallenna sijainti</label>
          <Switch
            disabled={metaData && metaData.permissions.geolocation === "denied" ? true : false}
            isActive={location !== null ? true : false}
            onClick={handleLocation}
            isLoading={isLoadingLocation}
          />
        </div>
        <div className={styles["new-game-form--form--button-container"]}>
          <Button
            type="submit"
            variant="primary"
          >
            <span>Lisää peli</span>
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={props.closeDialog}
          >
            <span>Sulje</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

const NewGame = () => {
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);

  return (
    <div className={styles["current-game--no-game"]}>
      <Button
        variant="wrapper"
        onClick={() => setIsNewGameDialogOpen(true)}
        aria-haspopup="dialog"
      >
        <div
          className={styles["current-game--new-game"]}
        >
          <b>Uusi peli&nbsp;</b>
          <span
            className={`material-symbol--container material-symbols-outlined`.trim()}
            aria-hidden={true}
          >
            add
          </span>
        </div>
      </Button>

      <Dialog
        isOpen={isNewGameDialogOpen}
        closeModal={() => setIsNewGameDialogOpen(false)}
      >
        <NewGameForm closeDialog={() => setIsNewGameDialogOpen(false)} />
      </Dialog>
    </div>
  );
};

interface GameHoleProps extends Hole {
  handleHolePlayerScore: (dir: "inc" | "dec", holeId: string, playerId: string) => void;
  handleFinishHole: (holeId: string) => void;
  historical: boolean;
  holeListLength: number;
  handleRenameHole?: (id: string, newName: number, hole: number) => void;
  index: number;
}

export const GameHole = memo(function GameHole(props: GameHoleProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [holeValue, setHoleValue] = useState(props.hole);
  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleHoleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoleValue(+e.target.value);
  };

  const handleNameSubmit = () => {
    if (props.handleRenameHole) {
      props.handleRenameHole(props.id, holeValue, props.hole);
    }

    setIsRenameOpen(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
  };

  const handleOpenNameEdit = () => {
    setIsRenameOpen(true);
  };

  // Focus on the input field when it's opened
  useEffect(() => {
    if (nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  }, [isRenameOpen]);

  return (
    <li className={`${styles["running-game--hole-info"]} ${!props.isActive && !props.historical ? styles["disabled"] : ""}`.trim()} id={"hole-" + props.id}>
      <div className={styles["running-game--hole-info--name"]}>
        <span>Reikä&nbsp;</span>
        <span>
          {isRenameOpen && !props.historical ?
            <span>
              <TextField
                ref={nameFieldRef}
                className={styles["running-game--hole-info--name-input"]}
                variant="outlined"
                name="new-game-holes"
                id="new-game-holes"
                onChange={handleHoleName}
                onKeyDown={handleNameKeyDown}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                pattern="[0-9]*"
                onBlur={handleNameSubmit}
                value={holeValue}
              />
            </span> :
            <span>{props.hole}</span>}
        </span>
        {!props.historical &&
          <span className={styles["running-game--hole-info--name-button--container"]}>
            <Button
              variant="wrapper"
              onClick={!isRenameOpen ? handleOpenNameEdit : handleNameSubmit}
            >
              <span className={styles["running-game--hole-info--name-button"]}>
                <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
                  edit
                </span>
              </span>
            </Button>
          </span>}
      </div>
      <PlayerScoreGrid
        hasButtons={true}
        handleHolePlayerScore={props.handleHolePlayerScore}
        scores={props.scores}
        id={props.id}
        isActive={props.isActive}
        hole={props.hole}
        historical={props.historical}
      />
      <div
        className={styles["running-game--hole-info--finish-game--container"]}
      >
        {!props.historical && <Button
          onClick={() => props.handleFinishHole(props.id)}
          variant="tertiary"
          endIcon={
            <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
              check_circle
            </span>
          }
        >
          <div
            className={styles["running-game--hole-info--finish-game--button"]}
          >
            {props.index === (props.holeListLength - 1) ?
              <span>Lisää reikä</span> :
              <span>Reikä valmis</span>}
          </div>
        </Button>}
      </div>
    </li>
  );
});

interface GameInfoProps {
  currentGamePlayers: Game["players"];
  historical?: boolean;
};

const GameInfo = memo(function GameInfo(props: GameInfoProps) {
  const playerWithLowestScore = useMemo(() => props.currentGamePlayers.reduce((lowest, player) => (
    player.totalScore < lowest.totalScore ? player : lowest
  )), [props.currentGamePlayers]);

  return (
    <PlayerScoreGrid
      hasButtons={false}
      scores={props.currentGamePlayers}
      leadingPlayer={playerWithLowestScore}
      historical={props.historical}
    />
  );
});

interface LocationProps {
  location: Game["location"];
}

const Location = (props: LocationProps) => {
  const { location } = props;

  if (!location) return null;

  return (
    <AnchorWrapper
      href={`https://www.google.com/maps/place/${location.latitude},${location.longitude}`}
      target="_blank"
      className={styles["running-game--game-location"]}
    >
      <span>Sijainti</span>
      <span className={`material-symbol--container material-symbols-outlined`.trim()}>
        open_in_new
      </span>
    </AnchorWrapper>
  );
};

interface RunningGameInfoProps {
  gameName: string;
  players: Player[];
  handleFinishGame?: () => void;
  location: Game["location"];
  historical?: boolean;
  date?: string;
  children: React.ReactNode;
}

export const RunningGameInfo = (props: RunningGameInfoProps) => {
  const { gameName, players, handleFinishGame, historical, date, location } = props;
  const [gameMoreInfoOpen, setGameMoreInfoOpen] = useState(!historical);
  const [confirmDialog, setConfirmDialog] = useState(false);

  return (
    <>
      <div
        className={styles["running-game--game-info"]}
        style={{ gap: gameMoreInfoOpen ? "0.25rem" : "unset" }}
      >
        <Button
          variant="wrapper"
          onClick={() => setGameMoreInfoOpen((prevValue) => !prevValue)}
          className={styles["running-game--game-name-container-wrapper"]}
          aria-expanded={gameMoreInfoOpen}
        >
          <div
            className={styles["running-game--game-name-container"]}
          >
            <div className={styles["running-game--game-name-name"]}>
              <h2>{gameName}</h2>
              {date &&
                <span
                  className={styles["running-game--game-name-date"]}
                >
                  {date}
                </span>}
            </div>

            <span
              className={styles["running-game--game-name-symbol"]}
            >
              <span className={`material-symbol--container material-symbols-outlined`.trim()}>
                {!gameMoreInfoOpen ? "expand_content" : "collapse_content"}
              </span>
            </span>
          </div>
        </Button>
        <div className={styles["running-game--game-info-container"]}>
          {gameMoreInfoOpen &&
            <>
              <GameInfo currentGamePlayers={players} historical={historical} />
              {(handleFinishGame || location) &&
                <div className={styles["running-game--game-info-settings"]}>
                  {handleFinishGame &&
                    <Button
                      variant="primary"
                      aria-haspopup="dialog"
                      onClick={() => setConfirmDialog(true)}
                    >
                      <span>Lopeta peli</span>
                    </Button>}
                  {location &&
                    <Location location={location} />}
                </div>}
            </>}
        </div>
      </div>
      <Dialog isOpen={confirmDialog} closeModal={() => setConfirmDialog(false)}>
        <div className={styles["running-game--game-info-settings--dialog-content"]}>
          <span>Lopeta peli?</span>
          <div className={styles["running-game--game-info-settings--dialog-content--buttons"]}>
            <Button
              onClick={handleFinishGame}
              variant="primary"
            >
              <span>Kyllä</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmDialog(false)}
            >
              <span>Ei</span>
            </Button>
          </div>
        </div>
      </Dialog>
      {props.historical ? gameMoreInfoOpen ?
        props.children :
        null :
        props.children}
    </>
  );
};

interface RunningGameProps {
  currentGame: Game;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const RunningGame = (props: RunningGameProps) => {
  const { currentGame, setGameState } = props;
  const holeListRef = useRef<HTMLUListElement>(null);
  const holeListChildrenWidths = useRef<{ width: number, id: string }[]>(null);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(() => {
    const holeIndex = currentGame.holeList.findIndex((h) => h.id === currentGame.currentHole);

    return holeIndex < 0 ? 0 : holeIndex;
  });
  const scrollFromButton = useRef<boolean>(false);
  const holeIndexRef = useRef<number>(null);

  const handleFinishGame = () => {
    props.setGameState((prevValue) => {
      const clonedValue = { ...prevValue };

      if (clonedValue.currentGame) {
        clonedValue.currentGame.endTime = new Date().getTime();
        clonedValue.history = [clonedValue?.currentGame, ...clonedValue.history];
      }

      clonedValue.currentGame = null;

      return clonedValue;
    })
  };

  // On mount scroll the hole that is current in the context object into view
  useEffect(() => {
    const element = document.getElementById("hole-" + currentGame.currentHole);

    if (element) {
      element.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Both total player game score and hole scores
  const handleHolePlayerScore = useCallback((dir: "inc" | "dec", holeId: string, playerId: string) => {
    if (dir === "inc") {
      setGameState((prevValue) => {
        if (!prevValue.currentGame) return prevValue;

        return {
          ...prevValue,
          currentGame: {
            ...prevValue.currentGame,
            players: prevValue.currentGame.players.map((p) => {
              return {
                ...p,
                totalScore: p.id === playerId ? p.totalScore + 1 : p.totalScore,
              };
            }),
            holeList: prevValue.currentGame.holeList.map((h) => {
              if (h.id === holeId) {
                return {
                  ...h,
                  scores: h.scores.map((p) =>
                    p.id === playerId
                      ? { ...p, totalScore: p.totalScore + 1 }
                      : p
                  ),
                };
              }

              return h;
            }),
          },
        };
      });
    } else {
      setGameState((prevValue) => {
        if (!prevValue.currentGame) return prevValue;

        return {
          ...prevValue,
          currentGame: {
            ...prevValue.currentGame,
            players: prevValue.currentGame.players.map((p) => {
              return {
                ...p,
                totalScore: p.id === playerId ? p.totalScore > 0 ? p.totalScore - 1 : p.totalScore : p.totalScore,
              };
            }),
            holeList: prevValue.currentGame.holeList.map((h) => {
              if (h.id === holeId) {
                return {
                  ...h,
                  scores: h.scores.map((p) =>
                    p.id === playerId
                      ? { ...p, totalScore: p.totalScore > 0 ? p.totalScore - 1 : p.totalScore }
                      : p
                  ),
                };
              }

              return h;
            }),
          },
        };
      });
    }
  }, [setGameState]);

  const handleFinishHole = useCallback((holeId: string) => {
    setGameState((prevValue) => {
      if (!prevValue.currentGame) return prevValue;

      const holeIndex = prevValue.currentGame.holeList.findIndex((h) => h.id === holeId);

      // Update the holeList
      const updatedHoleList = prevValue.currentGame.holeList.map((h) => {
        if (h.id === holeId) {
          return { ...h, isActive: !h.isActive };
        }

        return h;
      });

      // If it's the last hole, add a new one
      if (holeIndex === prevValue.currentGame.holeList.length - 1) {
        const lastHole = prevValue.currentGame.holeList[holeIndex];
        const newHole = {
          id: generateRandomId(),
          hole: lastHole.hole + 1,
          isActive: true,
          scores: lastHole.scores.map((s) => {
            const clonedPlayer = { ...s };
            clonedPlayer.totalScore = 0;

            return clonedPlayer;
          }),
        };

        updatedHoleList.push(newHole);
      }

      // Update the holeIndexRef for scrolling purposes in the useEffect hook - holeList replacing causes it to trigger
      // Could possibly update currentHoleIndex outsite of this state updating but the problem is preventing 
      // all the GameHoles from re-rendering since this function should be recreated when currentGame.holeList is updated
      if (prevValue.currentGame.holeList[holeIndex].isActive) {
        holeIndexRef.current = holeIndex + 1;
      } else {
        holeIndexRef.current = null;
      }

      return {
        ...prevValue,
        currentGame: {
          ...prevValue.currentGame,
          currentHole: prevValue.currentGame.holeList[holeIndex].id,
          holeList: updatedHoleList,
        },
      };
    });
  }, [setGameState]);

  // Side effect of currentHoleIndex changes is defined here, scrollFromButton ref is used to prevent
  // onScrollEnd event from affecting this hook
  useEffect(() => {
    if (!scrollFromButton.current && !holeIndexRef.current) return;

    const hole = currentGame.holeList[holeIndexRef.current ?? currentHoleIndex];
    holeIndexRef.current = null;

    if (!hole) return;

    const element = document.getElementById("hole-" + hole.id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });

      setGameState((prevValue) => {
        if (prevValue.currentGame) {
          prevValue.currentGame.currentHole = hole.id;

          return { ...prevValue };
        }

        return prevValue;
      });
    }
  }, [currentHoleIndex, currentGame.holeList, setGameState]);

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

              setGameState((prevValue) => {
                if (prevValue.currentGame) {
                  if (holeListChildrenWidths.current && prevValue.currentGame.currentHole !== holeListChildrenWidths.current[i].id.split("-")[1]) {
                    prevValue.currentGame.currentHole = holeListChildrenWidths.current[i].id.split("-")[1];

                    return { ...prevValue };
                  }
                }

                return prevValue;
              });

              setCurrentHoleIndex(i);

              return;
            }
          }
        }

        if (Math.abs(endingWidth) < currentWidth * 0.7) {
          const element = document.getElementById(holeListChildrenWidths.current[i + 1].id);

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });

            setGameState((prevValue) => {
              if (prevValue.currentGame) {
                if (holeListChildrenWidths.current && prevValue.currentGame.currentHole !== holeListChildrenWidths.current[i + 1].id.split("-")[1]) {
                  prevValue.currentGame.currentHole = holeListChildrenWidths.current[i + 1].id.split("-")[1];

                  return { ...prevValue };
                }
              }

              return prevValue;
            });

            setCurrentHoleIndex(i + 1);

            return;
          }
        }

        const element = document.getElementById(holeListChildrenWidths.current[i].id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });

          setGameState((prevValue) => {
            if (prevValue.currentGame) {
              if (holeListChildrenWidths.current && prevValue.currentGame.currentHole !== holeListChildrenWidths.current[i].id.split("-")[1]) {
                prevValue.currentGame.currentHole = holeListChildrenWidths.current[i].id.split("-")[1];

                return { ...prevValue };
              }
            }

            return prevValue;
          });

          setCurrentHoleIndex(i);

          return;
        }
      }
    }
  };

  const handleRenameHole = useCallback((id: string, newName: number, hole: number) => {
    setGameState((prevValue) => {
      const currentGame = prevValue.currentGame;

      if (!currentGame || !currentGame.id || !currentGame.holeList || hole === newName) {
        return prevValue;
      }

      return {
        ...prevValue,
        currentGame: {
          ...currentGame,
          holeList: currentGame.holeList.map((h) =>
            h.id === id ? { ...h, hole: newName } : h
          ),
        },
      };
    });
  }, [setGameState]);

  // Update the holeListChildrenWidths here when currentGame holeList array changes - it's for caching purposes
  useEffect(() => {
    holeListChildrenWidths.current = null;
  }, [currentGame.holeList.length]);

  return (
    <>
      <RunningGameInfo
        gameName={currentGame.name}
        players={currentGame.players}
        handleFinishGame={handleFinishGame}
        location={currentGame.location}
      >
        <div className={styles["running-game--hole-list--container"]}>
          <HoleNavigation
            scrollFromButton={scrollFromButton}
            currentHoleIndex={currentHoleIndex}
            setCurrentHoleIndex={setCurrentHoleIndex}
            currentGameHoleList={currentGame.holeList}
          />
          <ul
            className={styles["running-game--hole-list"]}
            ref={holeListRef}
            onScrollEnd={handleULOnScrollEnd}
          >
            {props.currentGame.holeList.map((hole, index) => (
              <GameHole
                key={hole.id}
                index={index}
                {...hole}
                handleHolePlayerScore={handleHolePlayerScore}
                handleFinishHole={handleFinishHole}
                historical={false}
                holeListLength={currentGame.holeList.length}
                handleRenameHole={handleRenameHole}
              />
            ))}
          </ul>
        </div>
      </RunningGameInfo>
    </>
  );
};

const CurrentGame = () => {
  const { gameState, isLoading, setGameState } = useGameState();

  if (isLoading) {
    return (
      <div className={styles["current-game--loading-container"]}>
        <ProgressActivity className="loading-icon" />
      </div>
    );
  }

  if (!gameState?.currentGame) {
    return (
      <NewGame />
    );
  }

  return (
    <RunningGame currentGame={gameState.currentGame} setGameState={setGameState} />
  );
};

export default CurrentGame;