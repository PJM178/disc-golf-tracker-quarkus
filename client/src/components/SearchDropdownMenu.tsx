import { useEffect, useRef, useState } from "react";
import TextField, { TextFieldProps } from "./Inputs";
import styles from "./SearchDropdownMenu.module.css";

interface SearchDropdownMenuProps extends TextFieldProps {
  data: Record<string, string | number>[];
}

const SearchDropdownMenu = (props: SearchDropdownMenuProps) => {
  const { data, value, ...TextFieldProps } = props;
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; height: number; width: number } | null>(null);

  const testData = [
    ...data,
    ...data,
    ...data,
  ];

  useEffect(() => {
    if (textFieldRef.current) {
      const { top, left, height, width } = textFieldRef.current.getBoundingClientRect();
      setRect({ top, left, height, width });
    }
  }, []);

  return (
    <div
      className={styles["container"]}
    >
      <TextField
        {...TextFieldProps}
        className={styles["input"]}
        ref={textFieldRef}
        value={value}
      />
      {data.length > 0 && rect &&
        <ul
          className={styles["list--container"]}
          style={{ top: (rect.top + rect.height) + "px", width: rect.width + "px" }}
        >
          {testData.map((r, i) => (
            <li
              key={i}
              className={styles["list--item"]}
            >
              <span>{r.name}</span>
            </li>
          ))}
        </ul>}
    </div>
  );
};

export default SearchDropdownMenu;