import classNames from "classnames";
import { forwardRef, LegacyRef } from "react";

export default forwardRef(InputBox);

function InputBox(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: LegacyRef<HTMLInputElement>
) {
  const { className, type = "text", ...rest } = props;
  return (
    <input
      ref={ref}
      type={type}
      className={classNames(
        className,
        "px-4 py-2 rounded border-slate-500 border-1"
      )}
      {...rest}
    />
  );
}
