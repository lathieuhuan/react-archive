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
import {
  wholeToString,
  numberToString,
  stringToNumber,
  limitFractionDigits,
  validateValue,
  digitCount,
} from "./utils";
import { FormatConfig, ValidateConfig, ValidateMode } from "./types";
import Button from "@Src/components/Button";
import Tooltip from "@Src/components/Tooltip";

export const GROUPING_SEPARATOR = ".";
export const DECIMAL_SEPARATOR = ",";

interface UpdateArgs {
  newValue: number;
  wholeAsString: string;
  fraction: number;
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
  const validateFraction = {
    maxFractionalDigits,
    exceedMaxDigitsAction,
  };
  const validate = {
    minValue: minValue !== undefined ? limitFractionDigits(minValue, validateFraction) : -Infinity,
    maxValue: maxValue !== undefined ? limitFractionDigits(maxValue, validateFraction) : Infinity,
    ...validateFraction,
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
    wholeAsString: newInputValue,
    fraction,
    withDecimalSeparator,
    newCursor,
    leftMoves,
    rightMoves,
  }: UpdateArgs) => {
    // input ends with decimalSeparator
    if (withDecimalSeparator) {
      newInputValue += format.decimalSeparator;
    }
    if (fraction !== 0) {
      newInputValue += fraction;
    }

    setInputValue(newInputValue);

    if (changeMode === "onChange" && typeof onChangeValue === "function") {
      onChangeValue(newValue);
    }

    // update cursor position
    runAfterPaint(() => {
      if (newCursor !== null) {
        // newCursor = 0 only when removing first digit
        newCursor += newCursor === 0 ? 0 : rightMoves - leftMoves;
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
      // it blinks
      setTimeout(() => {
        if (selectionStart) {
          inputRef.current?.setSelectionRange(selectionStart - 1, selectionStart - 1);
        }
      }, 0);
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
    let { value, selectionStart } = e.currentTarget;
    if (value === "") {
      value = "0";
    }

    if (upDownStep && [KEY.ArrowUp, KEY.ArrowDown].includes(e.key)) {
      // prevent cursor from moving to the first/last position on ArrowUp/ArrowDown
      e.preventDefault();
      const isArrowUp = e.key === KEY.ArrowUp;

      try {
        let {
          result: newValue,
          whole,
          fraction,
          withDecimalSeparator,
          leftMoves,
        } = stringToNumber(value, format, isValidateOnBlur ? undefined : validate);

        // #to-do handle case upDownStep is decimal
        whole += isArrowUp ? upDownStep : -upDownStep;
        newValue += isArrowUp ? upDownStep : -upDownStep;

        let rightMoves = 0;

        ({ validatedValue: newValue, whole, fraction, rightMoves, withDecimalSeparator } = validateValue(
          newValue,
          whole,
          fraction,
          validate
        ));
        
        let { result: wholeAsString, rightMoves: extraRightMoves } = wholeToString(whole, format);

        const diffNumOfDigits = digitCount(newValue) - value.length;

        if (diffNumOfDigits) {
          rightMoves += isArrowUp ? 1 : -1;
        }

        update({
          newValue,
          wholeAsString,
          fraction,
          withDecimalSeparator,
          newCursor: selectionStart,
          leftMoves,
          rightMoves,
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
      <Button className="bg-orange-500 hover:bg-orange-400 rounded-full group relative">
        <Tooltip
          className="w-80 h-60 -translate-x-1/2 left-1/2 whitespace-pre text-left"
          placement="bottom"
          text={JSON.stringify({ ...format, ...validate }, null, 2)}
        />
        <span className="text-xl">?</span>
      </Button>
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
