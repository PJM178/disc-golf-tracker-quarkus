import styles from "./Buttons.module.css";
import { ProgressActivity } from "./Loading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: ButtonVariants;
  disabled?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

type ButtonVariants = "primary" | "secondary" | "tertiary" | "wrapper";

export const Button = (props: ButtonProps) => {
  const { children, variant, className, startIcon, endIcon, disabled, ...rest } = props;

  const buttonStyles = {
    primary: styles["button--primary"],
    secondary: styles["button--secondary"],
    tertiary: styles["button--tertiary"],
    wrapper: styles["button--wrapper"],
  }

  if (variant === "wrapper") {
    return (
      <button
        className={`${className} ${buttonStyles[variant]}`.trim()}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${styles["button--base"]} ${buttonStyles[variant]}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {startIcon &&
        <span className={styles["button--icon"]}>{startIcon}</span>}
      {children}
      {endIcon &&
        <span className={styles["button--icon"]}>{endIcon}</span>}
    </button>
  );
};

interface SwitchProps {
  isActive: boolean;
  onClick: () => void;
  ariaLabelledBy?: string;
  disabled?: boolean;
  title?: string;
  isLoading?: boolean;
}

export const Switch = (props: SwitchProps) => {
  const { isActive, onClick, ariaLabelledBy, disabled, title, isLoading } = props;

  function handleStyles(element: "background" | "tack" | "tack-container") {
    if (element === "background") {
      const switchStyles = {
        base: styles["switch--background"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }

    if (element === "tack") {
      const switchStyles = {
        base: styles["switch--tack"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }

    if (element === "tack-container") {
      const switchStyles = {
        base: styles["switch--tack-container"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.code === "Enter" || e.code === "Space") {
      onClick();
    }
  };

  return (
    <span
      className={`${styles["switch--container"]} ${disabled ? ` ${styles["disabled"]}` : ""} ${isLoading ? ` ${styles["loading"]}` : ""}`.trim()}
      onClick={(!disabled || !isLoading) ? onClick : undefined}
      onKeyDown={!disabled ? handleKeyDown : undefined}
      role="switch"
      aria-checked={isActive}
      tabIndex={0}
      aria-labelledby={ariaLabelledBy}
      title={title}
      aria-disabled={disabled}
    >
      <span className={handleStyles("tack-container")}>
        <span className={handleStyles("tack")} />
        <span className={`${styles["switch--tack-border"]}${disabled ? ` ${styles["disabled"]}` : ""}`} />
      </span>
      <span className={handleStyles("background")} />
      {isLoading &&
        <span className={styles["loading-icon--container"]}>
          <ProgressActivity className={styles["loading-icon"]} />
        </span>}
    </span>
  );
};