import styles from "./Loading.module.css";

type CssUnit = "px" | "rem" | "em" | "%" | "vh" | "vw";
type CssSize = `${number}${CssUnit}` | "auto";

interface GeneralIconProps {
  className?: string;
}

interface SkeletonProps {
  width?: CssSize;
  height?: CssSize;
  variant: "text" | "circular" | "rectangular" | "rounded";
  // Avoid using !important here and use inlineSyles property where more specificity is required
  className?: string;
  // If maximum specificity is required use inline styles
  inlineStyles?: React.CSSProperties;
}

export const Skeleton = (props: SkeletonProps) => {
  const { width, height, variant, className, inlineStyles } = props;

  return (
    <span
      className={`${className ?? ""} ${styles["skeleton-base"]} ${styles[`skeleton-${variant}`] }`.trim()}
      style={{ width: width, height: height, ...inlineStyles }}
    />
  );
};

export const ProgressActivity = (props: GeneralIconProps) => {
  const { className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={`general-icon ${className}`}
    >
      <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
    </svg>
  );
};