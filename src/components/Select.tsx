import classNames from "classnames";
import { forwardRef } from "react";

type TOption = {
  className?: string;
  label: string | number;
  value?: string | number;
  disabled?: boolean;
};

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: TOption[];
}
const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, options, ...rest } = props;

  return (
    <select
      ref={ref}
      className={classNames(
        "px-4 py-2 rounded border-slate-500 border bg-transparent disabled:bg-slate-300",
        className
      )}
      {...rest}
    >
      {options.map((opt, index) => (
        <option key={index} className={opt.className} value={opt.value ?? opt.label} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

export default Select;
