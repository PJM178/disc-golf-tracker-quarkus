// Use reverse geocoding using the coordinates gotten from the gps location permission
// using a service provider such as OpenStreetMap

import { Button } from "./Buttons";
import useGeolocation from "@/hooks/useGeolocation";
import styles from "./UseLocation.module.css";
import { useState } from "react";
import { ProgressActivity } from "./Loading";

const UseLocation = () => {
  const [promptLocation, setPromptLocation] = useState(false);
  const { location, error, loading } = useGeolocation({ prompt: promptLocation });

  const handleClick = () => {
    setPromptLocation(true);
  };
  console.log(error);
  return (
    <Button
      variant="wrapper"
      onClick={handleClick}
      className={styles["button"]}
    >
      <div
        className={styles["button--main-content"]}
      >
        {!loading ?
          <span
            className={`material-symbol--container material-symbols-outlined ${!location ? "material-symbols-outlined--not-filled" : ""}`.trim()}
            aria-hidden={true}
          >
            near_me
          </span> :
          <span
            className={styles["button--main-content--loading"]}
          >
            <ProgressActivity className="loading-icon" />
          </span>}
        <span
          className={styles["button--main-content--location"]}
        >
          <span
            className="important-text"
          >
            Käytä nykyistä sijaintia
          </span>
          {error &&
            <span
              className="subtext"
            >
              Sijainnin määrittäminen epäonnistui
            </span>}
        </span>
      </div>
    </Button>
  );
};

export default UseLocation;