import classNames from "classnames";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: (string | number)[];
}
export default function Select({ className, options, ...rest }: SelectProps) {
  return (
    <select
      className={classNames(
        "px-4 py-2 rounded border-slate-500 border-1 bg-transparent disabled:bg-slate-300",
        className
      )}
      {...rest}
    >
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
