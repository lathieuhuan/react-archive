import classNames from "classnames";
import { forwardRef, LegacyRef } from "react";

export type InputBoxProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputBox = forwardRef((props: InputBoxProps, ref: LegacyRef<HTMLInputElement>) => {
  const { className, type = "text", ...rest } = props;
  return (
    <input
      ref={ref}
      type={type}
      className={classNames("px-4 py-2 rounded border-slate-500 border disabled:bg-slate-300", className)}
      {...rest}
    />
  );
});

export default InputBox;
