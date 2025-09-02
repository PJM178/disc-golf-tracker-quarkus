import { useState, useEffect, useRef } from "react";

const useDebounce = (value: string, timer: number) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, timer)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, timer]);

  return { debouncedValue };
};

export default useDebounce;