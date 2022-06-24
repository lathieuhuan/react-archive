import classNames from "classnames";

export default function Button({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        className,
        "px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white font-semibold cursor-pointer"
      )}
      {...rest}
    />
  );
}
