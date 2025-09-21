import { Game, useGameState, Hole } from "@/context/GameStateContext";
import { generateRandomId, NAVIGATION_KEYS } from "@/utils/utilities";
import { useState, useEffect, memo, useRef, useCallback } from "react";
import { Button, Switch } from "./Buttons";
import styles from "./NewGameForm.module.css"
import TextField from "./Inputs";
import useDebounce from "@/hooks/useDebounce";
import SearchDropdownMenu from "./SearchDropdownMenu";
import UseLocation from "./UseLocation";
import { Coordinates } from "@/hooks/useGeolocation";
import {
  CursorPaginatedCourseLocationSearch, CursorPaginatedCourseTextSearch,
  LocationCursor, TextCursor
} from "@/types/course";
import { JumpingDots } from "./Loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnchorWrapper } from "./Wrappers";
import React from "react";
import useInfiniteScroll from "@/hooks/useInifniteScroll";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const searchDropdownMenuUlRef = useRef<HTMLUListElement | null>(null);

  const fetchCoursesTextCursor = useCallback(async (query: string, nextCursor: TextCursor | null) => {
    if (query.length > 2) {
      const url = new URL("http://localhost:8080/courses/search/text");

      url.searchParams.set("query", query);

      if (nextCursor) {
        url.searchParams.set("cursorUuid", nextCursor.uuid);
      }

      const res = await fetch(url.toString(), {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Network error: " + res.status + " " + res.statusText);
      }

      const data: CursorPaginatedCourseTextSearch = await res.json();

      return data;
    }
  }, []);

  const fetchCoursesLocationCursor = useCallback(async (location: Coordinates | null, nextCursor: LocationCursor | null) => {
    console.log("called");
    if (location) {
      const url = new URL("http://localhost:8080/courses/search/location");

      url.searchParams.set("lat", location.lat.toString());
      url.searchParams.set("lon", location.lon.toString());

      if (nextCursor) {
        url.searchParams.set("cursorDistance", nextCursor.distance.toString());
        url.searchParams.set("cursorUuid", nextCursor.uuid);
      }

      const res = await fetch(url.toString(), {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Network error: " + res.status + " " + res.statusText);
      }

      const data: CursorPaginatedCourseLocationSearch = await res.json();

      return data;
    }
  }, []);

  const textQueryValue = locationName === "" ? "" : debouncedValue;

  const textSearchQuery = useInfiniteQuery({
    queryKey: ["courses", "text", textQueryValue],
    queryFn: ({ pageParam }) => fetchCoursesTextCursor(textQueryValue, pageParam),
    initialPageParam: { uuid: "" },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: textQueryValue.length > 2,
    staleTime: 1000 * 60,
  });

  const infiniteLocationQuery = useInfiniteQuery({
    queryKey: ["Courses", "location", location, location?.lat, location?.lon],
    queryFn: ({ pageParam }) => fetchCoursesLocationCursor(location, pageParam),
    initialPageParam: { distance: 0, uuid: "" },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!location,
    staleTime: 60000,
  });

  const { observerRef } = useInfiniteScroll<HTMLDivElement>({ onIntersect: infiniteLocationQuery.fetchNextPage, enabled: infiniteLocationQuery.hasNextPage && !infiniteLocationQuery.isFetching, root: searchDropdownMenuUlRef.current });

  const handleSearchField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
  };

  const handleFocus = () => {
    setIsListVisible(true);
  };

  const handleBlur = () => {
    setIsListVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (NAVIGATION_KEYS.has(e.key) || e.key === "Enter") {
      return;
    }

    if (location) {
      setLocation(null);
    }
  };

  const handleClickUseLocation = () => {
    setLocationName("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const renderStates = ({ isLoading, hasNextPage, isNoHits, shouldHaveMore, isError }: { isLoading?: boolean, hasNextPage?: boolean, isNoHits?: boolean, shouldHaveMore?: boolean, isError?: boolean }) => {
    if (isError) {
      return (
        <SearchDropdownMenu.Item key="data-state" disabled={true}>
          <div
            className={styles["new-game-form--form--search-result--container-loading"]}
          >
            <span>Jokin meni pieleen, koita myöhemmin uudestaan</span>
          </div>
        </SearchDropdownMenu.Item>
      );
    }

    if (isLoading) {
      return (
        <SearchDropdownMenu.Item key="data-state" disabled={true}>
          <div
            className={styles["new-game-form--form--search-result--container-loading"]}
          >
            <JumpingDots />
          </div>
        </SearchDropdownMenu.Item>
      );
    }

    if (isNoHits) {
      return (
        <SearchDropdownMenu.Item key="data-state" disabled={true}>
          <div
            className={styles["new-game-form--form--search-result--container-loading"]}
          >
            <span>Ei hakutuloksia</span>
          </div>
        </SearchDropdownMenu.Item>
      );
    }

    if (shouldHaveMore) {
      return (
        <SearchDropdownMenu.Item key="data-state" disabled={true}>
          <div
            className={styles["new-game-form--form--search-result--container-loading"]}
          >
            {hasNextPage ? <span>Lataa lisää</span> : <span>Ei enempää ratoja</span>}
          </div>
        </SearchDropdownMenu.Item>
      );
    }

    return null;
  };

  const renderData = (locationData: typeof infiniteLocationQuery.data, textData: typeof textSearchQuery.data) => {
    if (locationData) {
      return (
        [...locationData.pages.flatMap((group) =>
          group?.data.map((r) => (
            <SearchDropdownMenu.Item key={r.uuid} id={r.uuid}>
              <div className={styles["new-game-form--form--search-result--container"]}>
                <div className={styles["new-game-form--form--search-result--container-info"]}>
                  <span>{r.name}</span>
                  <span className="subtext">
                    {r.address}, {r.postalCode} {r.city}
                  </span>
                </div>
                <AnchorWrapper
                  href={`https://www.google.com/maps/place/${r.lat},${r.lon}`}
                  target="_blank"
                  className={styles["new-game-form--form--search-result--container-location"]}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{(r.distanceToUserCoordinates / 1000).toFixed(2)} km</span>
                  <span className="material-symbol--container material-symbols-outlined">
                    open_in_new
                  </span>
                </AnchorWrapper>
              </div>
            </SearchDropdownMenu.Item>
          ))
        ),]
      );
    }

    if (textData) {
      return (
        [...textData.pages.flatMap((group) =>
          group?.data.map((r) => (
            <SearchDropdownMenu.Item key={r.uuid} id={r.uuid}>
              <div className={styles["new-game-form--form--search-result--container"]}>
                <div className={styles["new-game-form--form--search-result--container-info"]}>
                  <span>{r.name}</span>
                  <span className="subtext">
                    {r.address}, {r.postalCode} {r.city}
                  </span>
                </div>
              </div>
            </SearchDropdownMenu.Item>
          ))
        ),]
      );
    }

    return null;
  };

  const data = renderData(infiniteLocationQuery.data, textSearchQuery.data);

  // isEnabled property value is controller by debouncedValue and location variables and
  // if one of these variables holds a value, other value is null or in the case of string length of 0
  // If the logic of these variables is changed, this should also be changed or rethought
  const queryObject = infiniteLocationQuery.isEnabled ? infiniteLocationQuery : textSearchQuery;

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
        onBlur={handleBlur}
      />
      <SearchDropdownMenu
        anchorElement={inputRef.current}
        listRef={searchDropdownMenuUlRef}
        setSelectedIndex={setSelectedIndex}
        isOpen={isListVisible}
        setIsOpen={setIsListVisible}
      >
        {queryObject.isLoading ?
          renderStates({ isLoading: true }) :
          queryObject.isError ?
            renderStates({ isError: true }) :
            data ?
              [...data,
              renderStates({ isLoading: queryObject.isFetching, isNoHits: !data.length && queryObject.isFetched, shouldHaveMore: !textSearchQuery.isEnabled && !queryObject.isPending, hasNextPage: queryObject.hasNextPage }),
              queryObject.hasNextPage ?
                <SearchDropdownMenu.Item key={"load more"} className={styles["observer-element"]} disabled={true}>
                  <div ref={observerRef}></div>
                </SearchDropdownMenu.Item> :
                null,] :
              null}
      </SearchDropdownMenu>
      <UseLocation
        onClick={handleClickUseLocation}
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