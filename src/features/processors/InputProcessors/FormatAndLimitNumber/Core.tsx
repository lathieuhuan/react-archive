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
import { FormatConfig, ValidateConfig, Fraction, ValidateMode } from "./types";

interface UpdateArgs {
  newValue: number;
  wholeAsString: string;
  fraction: Fraction;
  withDecimalSeparator: boolean;
  newCursor: number | null;
  separatorsRemoved: number;
  separatorsAdded: number;
}

interface CoreProps extends Partial<FormatConfig>, Partial<ValidateConfig> {
  value: number;
  upDownStep?: number;
  changeMode?: "onChange" | "onBlur";
  validateMode?: ValidateMode;
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
  validateMode = "onChangePrevent",
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
  };
  const validate = {
    minValue,
    maxValue,
    maxFractionalDigits: maxFractionalDigits || 0,
    exceedMaxDigitsAction: exceedMaxDigitsAction || "cutoff",
    validateMode,
  };
  const isValidateOnChange = ["onChangePrevent", "onChangeGoBack"].includes(validateMode);

  // change separator in case they're the same
  if (format.decimalSeparator === format.groupingSeparator) {
    format.decimalSeparator = format.decimalSeparator === "." ? "," : ".";
  }

  useEffect(() => {
    setInputValue(numberToString(value, format, validate));
  }, [testSignal]);

  const update = ({
    newValue,
    wholeAsString,
    fraction,
    withDecimalSeparator,
    newCursor,
    separatorsRemoved,
    separatorsAdded,
  }: UpdateArgs) => {
    // input ends with decimalSeparator
    if (withDecimalSeparator) {
      wholeAsString += format.decimalSeparator;
    }
    if (fraction !== 0) {
      wholeAsString += fraction;
    }

    setInputValue(wholeAsString);

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

      if (value === "-") {
        setInputValue("-");
        return;
      }
      const {
        result: newValue,
        whole,
        fraction,
        withDecimalSeparator,
        separatorsRemoved,
      } = stringToNumber(value, format, isValidateOnChange ? validate : undefined);

      const { result: wholeAsString, separatorsAdded } = wholeToString(whole, format);

      update({
        newValue,
        // prevent typing "0", if not zero is always there instead of ""
        wholeAsString: wholeAsString === "0" ? "" : wholeAsString,
        fraction,
        withDecimalSeparator,
        newCursor: e.target.selectionStart,
        separatorsRemoved,
        separatorsAdded,
      });
    } catch (error) {
      // console.log(error);
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
      setInputValue(minValue ? numberToString(minValue, format, validate) : "0");
      return;
    }
    try {
      if (changeMode === "onBlur") {
        let { result } = stringToNumber(
          inputValue,
          format,
          !isValidateOnChange ? validate : undefined
        );

        setInputValue(numberToString(result, format));

        if (typeof onChangeValue === "function") {
          onChangeValue(result);
        }
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
        } = stringToNumber(value, format, isValidateOnChange ? validate : undefined);

        // #to-do handle case upDownStep is decimal
        whole += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;
        newValue += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;

        const wholeAsString = wholeToString(whole, format).result;

        // update({
        //   fraction,
        //   newCursor: e.currentTarget.selectionStart,
        //   newValue,
        //   wholeAsString,
        //   separatorsRemoved,
        //   separatorsAdded: 999999,
        // });
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
