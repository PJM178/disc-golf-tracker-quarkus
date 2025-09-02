import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lon: number;
}

interface Error {
  message: string;
}

interface UseGeolocationProps {
  prompt: boolean;
}

const useGeolocation = (props: UseGeolocationProps) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPositionAsync = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos), (err) => reject(err));
    });
  };

  useEffect(() => {
    if (!props.prompt) return;

    if (!("geolocation" in navigator)) {
      setError({ message: "Laitteen sijainti ei tuettu" });

      return;
    }

    setLoading(true);

    async function handleLocation() {
      try {
        const location = await getCurrentPositionAsync();

        setLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError({ message: "Sijainnin oikeudet kielletty" });
              console.error("Sijainnin oikeudet kielletty");
              console.error("Error: " + err.message);
              break;
            case err.POSITION_UNAVAILABLE:
              setError({ message: "Sijainti ei saatavilla" });
              console.error("Error: " + err.message);
              break;
            case err.TIMEOUT:
              setError({ message: "Sijainnin saamiseen kesti liian kauan" });
              console.error("Error: " + err.message);
              break;
          }
        } else {
          setError({ message: "Jokin meni pieleen sijainnin kanssa" })
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }

    handleLocation();
  }, [props.prompt]);

  return { location, error, loading };
};

export default useGeolocation;