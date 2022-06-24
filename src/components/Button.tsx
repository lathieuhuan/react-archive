import cn from "classnames";
import { ComponentProps } from "./types";

export default function Button({ className, ...rest }: ComponentProps) {
  return (
    <button
      className={cn(
        className,
        "px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white font-semibold cursor-pointer"
      )}
      {...rest}
    />
  );
}
