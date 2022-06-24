import cn from "classnames";
import { forwardRef, LegacyRef } from "react";
import { ComponentProps } from "./types";

type TextInputProps = ComponentProps & { type?: "text" | "number" };

export default forwardRef(InputBox);

function InputBox({
  className,
  type = "text",
  ...rest
}: TextInputProps, ref: LegacyRef<HTMLInputElement>) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(className, "px-4 py-2 rounded border-slate-500 border-2")}
      {...rest}
    />
  );
}
