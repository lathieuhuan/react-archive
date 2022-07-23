import classNames from "classnames";
import {
  type InputHTMLAttributes,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

export default function AutoResizeInput() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Auto-resize Input</h2>
      <UseSizeAttr />
      <UseDatasetAndCss1 />
      <UseDatasetAndCss2 />
    </div>
  );
}

const Note = ({ children }: { children: ReactNode }) => {
  return <p className="mt-1 text-sm italic">{children}</p>;
};

function UseSizeAttr() {
  const [value, setValue] = useState("");
  let inputSize = Math.max(value.length, 1);

  return (
    <div>
      <h3 className="text-xl text-red-600">
        Use 'size' attribute of the input element
      </h3>
      <Note>Only works in some unknown cases.</Note>
      <div className="mt-3 flex">
        <label className="mr-2">Label:</label>
        <input
          className="border-slate-300 border-1 outline-none"
          size={inputSize}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

function UseDatasetAndCss1() {
  const [value, setValue] = useState("");

  return (
    <div>
      <h3 className="text-xl text-blue-600">Use dataset and CSS</h3>
      <Note>
        Initial width cannot be set as expected, size = 1 is still wide.
      </Note>
      <Note>
        Input cannot have padding or some letters will be clipped.{" "}
        <Link
          className="text-red-600"
          to="https://css-tricks.com/auto-growing-inputs-textareas/"
        >
          Css-tricks
        </Link>{" "}
        somehow can manage this.
      </Note>
      <div className={classNames("mt-3", styles.inputWrapper1)}>
        <label className="mr-2">Label:</label>
        <input
          className="rounded-sm border-1 border-slate-300 outline-none"
          size={1}
          value={value}
          onChange={(e) => {
            const { value } = e.target;
            setValue(value);
            (e.target.parentNode as HTMLDivElement).dataset.value = value;
          }}
        />
      </div>
    </div>
  );
}

function UseDatasetAndCss2() {
  const [value, setValue] = useState("");

  return (
    <div>
      <h3 className="text-xl text-green-600">Use dataset and CSS</h3>
      <Note>A different approach.</Note>
      <div className="mt-2 flex items-center">
        <label className="mr-2">Label:</label>
        <ValueFitInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

interface ValueFitInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}
export function ValueFitInput(props: ValueFitInputProps) {
  const { className, wrapperClassName, value, onChange, ...rest } = props;
  return (
    <div
      className={classNames("relative", styles.inputWrapper2, wrapperClassName)}
      data-value={value}
    >
      <input
        className={classNames(
          "absolute top-0 bottom-0 left-0 right-0 rounded-sm border-1 border-slate-300 outline-none",
          className
        )}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}
