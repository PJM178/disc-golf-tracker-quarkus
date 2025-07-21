import styles from "./Wrappers.module.css"

interface AnchorWrapperProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnchorWrapper = (props: AnchorWrapperProps) => {
  const { children, className, ...rest } = props;

  return (
    <a className={`${styles["anchor-wrapper--container"]} ${className || ""}`.trim()} { ...rest }>
      {children}
    </a>
  );
};