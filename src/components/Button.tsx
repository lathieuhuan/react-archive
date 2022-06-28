import classNames from "classnames";

export default function Button({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 cursor-pointer",
        "text-white font-semibold disabled:bg-slate-400",
        className,
      )}
      {...rest}
    />
  );
}
