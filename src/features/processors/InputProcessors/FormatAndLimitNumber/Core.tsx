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
import { FormatConfig, KeydownConfig } from "./types";

interface UpdateArgs {
  fraction: number | undefined;
  newValue: number;
  newInputValue: string;
  newCursor: number | null;
  separatorsRemoved: number;
  separatorsAdded: number;
}

interface CoreProps {
  value: number;
  maxValue?: number;
  minValue?: number;
  formatConfig?: Partial<FormatConfig>;
  keydownConfig?: KeydownConfig;
  changeMode?: "onChange" | "onBlur";
  validateMode?: "onChange" | "onBlur";
  testSignal: boolean;
  onChangeValue?: (value: number) => void;
}
export default function Core({
  value,
  maxValue,
  minValue,
  formatConfig = {},
  keydownConfig,
  changeMode = "onChange",
  validateMode = "onChange",
  testSignal,
  onChangeValue,
}: CoreProps) {
  //
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const runAfterPaint = useRunAfterPaint();

  const finalFormatConfig: FormatConfig = {
    groupingSeparator: ".",
    decimalSeparator: ",",
    maxFractionalDigits: 1,
    ...formatConfig,
  };

  // change separator in case they're the same
  if (finalFormatConfig.decimalSeparator === finalFormatConfig.groupingSeparator) {
    finalFormatConfig.decimalSeparator = finalFormatConfig.decimalSeparator === "." ? "," : ".";
  }

  useEffect(() => {
    setInputValue(numberToString(minValue || value, finalFormatConfig));
  }, [testSignal]);

  const validateValue = () => {
    
  }

  const update = ({
    fraction,
    newValue,
    newInputValue,
    newCursor,
    separatorsRemoved,
    separatorsAdded,
  }: UpdateArgs) => {
    //
    if (fraction !== undefined) {
      // input ends with decimalSeparator
      let fractionalPart = finalFormatConfig.decimalSeparator;
      if (fraction !== 0) {
        fractionalPart += fraction;
      }
      newInputValue += fractionalPart;
    }

    setInputValue(newInputValue);

    if (changeMode === "onChange" && onChangeValue) {
      onChangeValue(newValue);
    }

    // update cursor
    runAfterPaint(() => {
      if (newCursor !== null) {
        newCursor += separatorsAdded - separatorsRemoved;
        // inputRef.current?.setSelectionRange(newCursor, newCursor);
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
      } = stringToNumber(value, finalFormatConfig);

      let { result: newInputValue, separatorsAdded } = wholeToString(whole, finalFormatConfig);

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
      setInputValue(minValue ? numberToString(minValue, finalFormatConfig) : "0");
      return;
    }

    try {
      let { result } = stringToNumber(inputValue, finalFormatConfig);

      if (maxValue !== undefined && result > maxValue) {
        result = maxValue;
      }
      if (minValue !== undefined && result < minValue) {
        result = minValue;
      }

      setInputValue(numberToString(result, finalFormatConfig));

      if (onChangeValue) {
        onChangeValue(result);
      }
    } catch (error) {
      //
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!keydownConfig) {
      return;
    }

    const { upDownStep } = keydownConfig;
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
        } = stringToNumber(value, finalFormatConfig);

        whole += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;
        newValue += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;

        const newInputValue = wholeToString(whole, finalFormatConfig).result;

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
