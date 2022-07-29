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
import { wholeToString, numberToString, stringToNumber, limitFractionDigits } from "./utils";
import { FormatConfig, ValidateConfig, Fraction, ValidateMode } from "./types";

export const GROUPING_SEPARATOR = ".";
export const DECIMAL_SEPARATOR = ",";

interface UpdateArgs {
  newValue: number;
  wholeAsString: string;
  fraction: Fraction;
  withDecimalSeparator: boolean;
  newCursor: number | null;
  leftMoves: number;
  rightMoves: number;
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
  maxFractionalDigits = 0,
  exceedMaxDigitsAction = "prevent",
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
    groupingSeparator: groupingSeparator || GROUPING_SEPARATOR,
    decimalSeparator: decimalSeparator || DECIMAL_SEPARATOR,
  };
  const validate = {
    minValue: minValue ? limitFractionDigits(minValue, maxFractionalDigits) : -Infinity,
    maxValue: maxValue ? limitFractionDigits(maxValue, maxFractionalDigits) : Infinity,
    maxFractionalDigits,
    exceedMaxDigitsAction,
    validateMode,
  };
  const isValidateOnBlur = validateMode === "onBlur";

  // change separator in case they're the same
  if (format.decimalSeparator === format.groupingSeparator) {
    format.decimalSeparator =
      format.decimalSeparator === GROUPING_SEPARATOR ? DECIMAL_SEPARATOR : GROUPING_SEPARATOR;
  }

  // make sure min is smaller than max
  if (validate.maxValue < validate.minValue) {
    [validate.minValue, validate.maxValue] = [validate.maxValue, validate.minValue];
  }

  useEffect(() => {
    setInputValue(
      numberToString(value, format, {
        ...validate,
        validateMode: "onChangeSetBack", // prevent value out of range
      })
    );
  }, [testSignal]);

  const update = ({
    newValue,
    wholeAsString,
    fraction,
    withDecimalSeparator,
    newCursor,
    leftMoves,
    rightMoves,
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
        newCursor += rightMoves - leftMoves;
        inputRef.current?.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    let { value, selectionStart } = e.target;

    try {
      if (value === "-") {
        setInputValue("-");
        return;
      }
      const {
        result: newValue,
        whole,
        fraction,
        withDecimalSeparator,
        leftMoves,
      } = stringToNumber(value, format, isValidateOnBlur ? undefined : validate);

      const { result: wholeAsString, rightMoves } = wholeToString(whole, format);

      update({
        newValue,
        // prevent typing "0", if not zero is always there instead of ""
        wholeAsString: wholeAsString === "0" ? "" : wholeAsString,
        fraction,
        withDecimalSeparator,
        newCursor: selectionStart,
        leftMoves,
        rightMoves,
      });
    } catch (error) {
      // need to manually track cursor
      // setTimeout(() => {
      //   if (selectionStart) {
      //     inputRef.current?.setSelectionRange(selectionStart - 1, selectionStart - 1);
      //   }
      // }, 0);
    }
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "0") {
      setInputValue("");
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    /**
     * run even if changeMode === "onChange" to cover case
     * inputValue === "" => show "0"
     * need format and validate if min > 0
     */
    try {
      let result = validate.minValue === -Infinity ? 0 : validate.minValue;

      result = stringToNumber(
        inputValue === "" ? "0" : inputValue,
        format,
        isValidateOnBlur
          ? {
              ...validate,
              validateMode: "onChangeSetBack", // set back when out of range
            }
          : undefined
      ).result;

      setInputValue(numberToString(result, format));

      if (typeof onChangeValue === "function") {
        onChangeValue(result);
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
          leftMoves,
        } = stringToNumber(value, format, isValidateOnBlur ? validate : undefined);

        // #to-do handle case upDownStep is decimal
        whole += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;
        newValue += e.key === KEY.ArrowUp ? upDownStep : -upDownStep;

        const wholeAsString = wholeToString(whole, format).result;

        // update({
        //   fraction,
        //   newCursor: e.currentTarget.selectionStart,
        //   newValue,
        //   wholeAsString,
        //   leftMoves,
        //   rightMoves: 999999,
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
