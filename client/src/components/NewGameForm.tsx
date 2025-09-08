import { Game, useGameState, Hole } from "@/context/GameStateContext";
import { generateRandomId } from "@/utils/utilities";
import { useState, useEffect, memo, useRef } from "react";
import { Button, Switch } from "./Buttons";
import styles from "./NewGameForm.module.css"
import TextField from "./Inputs";
import useDebounce from "@/hooks/useDebounce";
import SearchDropdownMenu from "./SearchDropdownMenu";
import UseLocation from "./UseLocation";
import { Coordinates } from "@/hooks/useGeolocation";
import { CourseLocationSearch } from "@/types/course";
import { JumpingDots } from "./Loading";

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

const FindCourse = () => {
  const [locationName, setLocationName] = useState<string>("");
  const { debouncedValue } = useDebounce(locationName, 500);
  const [data, setData] = useState<CourseLocationSearch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (debouncedValue && debouncedValue.length > 2) {
      async function fetchCourses() {
        setLoadingData(true);

        try {
          const res = await fetch(`http://localhost:8080/courses/search-full-text?location=${debouncedValue}`, {
            method: "GET",
          });

          if (res.ok) {
            const data = await res.json();

            setData(data);
          }
        } catch (err) {
          console.log("Something went wrong: ", err);
        } finally {
          setLoadingData(false);
        }
      }

      fetchCourses();
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (location) {
      async function fetchCourses() {
        setLoadingData(true);

        if (inputRef.current) {
          inputRef.current.focus();
        }

        try {
          const res = await fetch(`http://localhost:8080/courses/search-full-text?${location ? "&lat=" + location.lat + "&lon=" + location.lon : ""}`, {
            method: "GET",
          });

          if (res.ok) {
            const data = await res.json();

            setLocationName("");
            setData(data);
          }
        } catch (err) {
          console.log("Something went wrong: ", err);
        } finally {
          setLoadingData(false);
        }
      }

      fetchCourses();
    }
  }, [location]);

  const handleSearchField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
  };

  const handleFocus = () => {
    setIsListVisible(true);
  };

  const handleKeyDown = () => {
    if (location) {
      setLocation(null);
    }
  };
  console.log(data);
  return (
    <div>
      <TextField
        className={styles["new-game-form--form--text-field"]}
        variant="outlined"
        placeholder={location ? "Haetaan lähellä olevia ratoja" : "Etsi ratoja osoitteen perusteella"}
        value={location ? "" : locationName}
        onChange={handleSearchField}
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
      <SearchDropdownMenu
        anchorElement={inputRef.current}
        setSelectedIndex={setSelectedIndex}
        isOpen={isListVisible}
        setIsOpen={setIsListVisible}
        liClass={loadingData ? styles["li-class"] : undefined}
      >
        {loadingData ?
          <div
            className={styles["new-game-form--form--search-result--container-loading"]}
          >
            <JumpingDots />
          </div> :
          data.map((r) => (
            <div
              key={r.uuid}
              className={styles["new-game-form--form--search-result--container"]}
            >
              <div
                className={styles["new-game-form--form--search-result--container-info"]}
              >
                <span>{r.name}</span>
                <span
                  className="subtext"
                >
                  {r.address}, {r.postalCode} {r.city}
                </span>
              </div>
            </div>
          ))
        }
      </SearchDropdownMenu>
      <UseLocation
        setLocation={setLocation}
      />
    </div>
  );
};

type NewGameType = Omit<Game, "startTime" | "endTime" | "currentHole">;

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
      <FindCourse />
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

export default NewGameForm;