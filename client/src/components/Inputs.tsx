import styles from "./Inputs.module.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant: "outlined";
  ref?: React.RefObject<HTMLInputElement | null>
}

const TextField = (props: TextFieldProps) => {
  const { variant, className, ref, ...rest } = props;

  const textFieldStyles = {
    outlined: styles["textfield--outlined"],
  }

  return (
    <input
      {...rest}
      ref={ref}
      className={`${className} ${textFieldStyles[variant]}`.trim()}
    />
  );
};

export default TextField;