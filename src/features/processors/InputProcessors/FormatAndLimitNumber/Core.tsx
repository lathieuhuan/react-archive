import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InputBox from "@Components/InputBox";
import { KEY } from "@Src/constant";
import { wholeToString, numberToString, stringToNumber } from "./utils";
import { FormatConfig, Fraction } from "./types";

interface UpdateArgs {
  fraction: Fraction;
  newValue: number;
  newInputValue: string;
  newCursor: number | null;
  separatorsRemoved: number;
  separatorsAdded: number;
}

interface CoreProps extends Partial<FormatConfig> {
  value: number;
  maxValue?: number;
  minValue?: number;
  /**
   * keydown config
   */
  upDownStep?: number;
  /**
   * behavior config
   */
  changeMode?: "onChange" | "onBlur";
  validateMode?: "onChange" | "onBlur";
  testSignal: boolean;
  onChangeValue?: (value: number) => void;
}
export default function Core({
  value,
  maxValue,
  minValue,
  groupingSeparator,
  decimalSeparator,
  maxFractionalDigits,
  exceedMaxDigitsAction,
  upDownStep,
  changeMode = "onChange",
  validateMode = "onChange",
  testSignal,
  onChangeValue,
}: CoreProps) {
  //
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const runAfterPaint = useRunAfterPaint();

  const format = {
    groupingSeparator: groupingSeparator || ".",
    decimalSeparator: decimalSeparator || ",",
    maxFractionalDigits: maxFractionalDigits || 0,
    exceedMaxDigitsAction: exceedMaxDigitsAction || "cutoff"
  };

  // change separator in case they're the same
  if (format.decimalSeparator === format.groupingSeparator) {
    format.decimalSeparator = format.decimalSeparator === "." ? "," : ".";
  }

  useEffect(() => {
    setInputValue(numberToString(minValue || value, format));
  }, [testSignal]);

  const valueAfterValidate = (value: number) => {
    if (minValue !== undefined && maxValue !== undefined) {
      if (maxValue < minValue) {
        return value;
      }
      return Math.min(maxValue, Math.max(minValue, value));
    } //
    else if (maxValue !== undefined) {
      if (value > maxValue) {
        return maxValue;
      }
    } //
    else if (minValue !== undefined) {
      if (value < minValue) {
        return minValue;
      }
    }
    return value;
  };

  const update = ({
    fraction,
    newValue,
    newInputValue,
    newCursor,
    separatorsRemoved,
    separatorsAdded,
  }: UpdateArgs) => {
    // input ends with decimalSeparator
    if (fraction !== undefined) {
      let fractionalPart = format.decimalSeparator;

      if (fraction !== 0) {
        fractionalPart += fraction;
      }
      newInputValue += fractionalPart;
    }

    setInputValue(newInputValue);

    if (changeMode === "onChange" && typeof onChangeValue === "function") {
      onChangeValue(newValue);
    }

    // update cursor position
    runAfterPaint(() => {
      if (newCursor !== null) {
        newCursor += separatorsAdded - separatorsRemoved;
        inputRef.current?.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      let { value } = e.target;
      const {
        result: newValue,
        whole,
        fraction,
        separatorsRemoved,
      } = stringToNumber(value, format);

      let { result: newInputValue, separatorsAdded } = wholeToString(whole, format);

      if (value === "-") {
        newInputValue = "-";
      }
      // prevent typing "0", if not zero is always there instead of ""
      else if (newInputValue === "0") {
        newInputValue = "";
      }

      update({
        fraction,
        newCursor: e.target.selectionStart,
        newValue,
        newInputValue,
        separatorsRemoved,
        separatorsAdded,
      });
    } catch (error) {
      console.log((error as Error).message);
      // need to manually track cursor
      // setTimeout(() => {
      //   inputRef.current?.setSelectionRange(trackedCursor, trackedCursor);
      // }, 0);
    }
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "0") {
      setInputValue("");
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "") {
      setInputValue(minValue ? numberToString(minValue, format) : "0");
      return;
    }

    try {
      let { result } = stringToNumber(inputValue, format);

      const validatedResult = valueAfterValidate(result);

      setInputValue(numberToString(validatedResult, format));

      if (typeof onChangeValue === "function") {
        onChangeValue(validatedResult);
      }
    } catch (error) {
      //
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    let { value } = e.currentTarget;
    if (value === "") {
      value = "0";
    }

    if (upDownStep && [KEY.ArrowDown, KEY.ArrowUp].includes(e.key)) {
      // prevent cursor from moving to first/last index on ArrowUp/ArrowDown
      e.preventDefault();

      try {
        let {
          result: newValue,
          whole,
          fraction,
          separatorsRemoved,
        } = stringToNumber(value, format);

        // #to-do handle case upDownStep is decimal
        whole += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;
        newValue += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;

        const newInputValue = wholeToString(whole, format).result;

        update({
          fraction,
          newCursor: e.currentTarget.selectionStart,
          newValue,
          newInputValue,
          separatorsRemoved,
          separatorsAdded: 999999,
        });
      } catch (error) {
        //
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label>Input</label>
      <InputBox
        ref={inputRef}
        value={inputValue}
        onChange={onChangeInputValue}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

const useRunAfterPaint = () => {
  const afterPaintRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (afterPaintRef.current) {
      afterPaintRef.current();
      afterPaintRef.current = null;
    }
  });
  return (fn: () => void) => (afterPaintRef.current = fn);
};
