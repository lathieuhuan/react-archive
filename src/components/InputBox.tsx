import classNames from "classnames";
import { forwardRef, LegacyRef } from "react";

const InputBox = forwardRef(
  (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    const { className, type = "text", ...rest } = props;
    return (
      <input
        ref={ref}
        type={type}
        className={classNames(
          "px-4 py-2 rounded border-slate-500 border disabled:bg-slate-300",
          className
        )}
        {...rest}
      />
    );
  }
);

export default InputBox;
