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
  limitFractionDigits,
  initInputInfo,
  validateInputInfo,
  wholeToString,
  joinDecimal,
  splitDecimal,
} from "./utils";
import { FormatConfig, InputInfo, ValidateConfig, ValidateMode } from "./types";
import Button from "@Src/components/Button";
import Tooltip from "@Src/components/Tooltip";

const GROUPING_SEPARATOR = ".";
const DECIMAL_SEPARATOR = ",";
const MAXIMUM = Math.pow(10, 12);

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
    minValue: minValue !== undefined ? limitFractionDigits(minValue, validateFraction) : -MAXIMUM,
    maxValue: maxValue !== undefined ? limitFractionDigits(maxValue, validateFraction) : MAXIMUM,
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
    const [whole, fraction] = splitDecimal(value);

    const inputInfo: InputInfo = {
      whole,
      fraction,
      isNegative: value < 0,
      withDecimalSeparator: fraction !== 0,
      cursorMoves: 999999999,
    };

    validateInputInfo(inputInfo, {
      ...validate,
      validateMode: "onChangeSetBack", // set back when out of range
    });

    const [newInputValue, newValue] = getResult(inputInfo);

    setInputValue(newInputValue);

    if (typeof onChangeValue === "function") {
      onChangeValue(newValue);
    }
  }, [testSignal]);

  const getResult = (inputInfo: InputInfo) => {
    let newInputValue = wholeToString(inputInfo, format);

    if (inputInfo.isNegative) {
      newInputValue = "-" + newInputValue;
    }
    if (validate.maxFractionalDigits && inputInfo.withDecimalSeparator && newInputValue !== "-") {
      newInputValue += format.decimalSeparator;
      if (inputInfo.fraction !== 0) {
        newInputValue += inputInfo.fraction;
      }
    }

    return [
      newInputValue,
      joinDecimal(inputInfo.whole, inputInfo.fraction, inputInfo.isNegative),
    ] as const;
  };

  const update = (inputInfo: InputInfo, newCursor: number | null) => {
    const [newInputValue, newValue] = getResult(inputInfo);

    setInputValue(newInputValue);

    if (changeMode === "onChange" && typeof onChangeValue === "function") {
      onChangeValue(newValue);
    }

    // update cursor position
    runAfterPaint(() => {
      if (newCursor !== null) {
        // keep cursor after 0 (0 is intended to not be removed)
        if (["0", "-0"].includes(newInputValue)) {
          newCursor++;
        } //
        else {
          newCursor += inputInfo.cursorMoves;
        }
        newCursor = Math.max(newCursor, 0);

        inputRef.current?.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    let { value, selectionStart } = e.target;

    try {
      const inputInfo = initInputInfo(value, format);

      if (isValidateOnBlur) {
        // default validate
        validateInputInfo(inputInfo, {
          maxValue: MAXIMUM,
          minValue: -MAXIMUM,
          maxFractionalDigits: 12,
          exceedMaxDigitsAction: "prevent",
          validateMode: "onChangePrevent",
        });
      } else {
        validateInputInfo(inputInfo, validate);
      }

      update(inputInfo, selectionStart);
    } catch (error) {
      console.log((error as Error).message);

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
    try {
      const inputInfo = initInputInfo(inputValue, format);

      if (isValidateOnBlur) {
        validateInputInfo(inputInfo, {
          ...validate,
          validateMode: "onChangeSetBack", // set back when out of range
        });
      }
      const [newInputValue, newValue] = getResult({
        ...inputInfo,
        withDecimalSeparator: inputInfo.fraction !== 0,
      });

      setInputValue(newInputValue);

      if (typeof onChangeValue === "function") {
        onChangeValue(newValue);
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

      try {
        const isArrowUp = e.key === KEY.ArrowUp;
        const inputInfo = initInputInfo(inputValue, format);
        let validatedStep = Math.min(upDownStep, 0);
        let value = joinDecimal(inputInfo.whole, inputInfo.fraction, inputInfo.isNegative);

        if (Math.floor(upDownStep) !== upDownStep) {
          validatedStep = limitFractionDigits(upDownStep, validateFraction);
        }

        value += isArrowUp ? validatedStep : -validatedStep;

        [inputInfo.whole, inputInfo.fraction] = splitDecimal(value);
        inputInfo.isNegative = value < 0;
        inputInfo.withDecimalSeparator = Math.floor(value) !== value;

        if (!isValidateOnBlur) {
          validateInputInfo(inputInfo, validate);
        }

        update(inputInfo, selectionStart);
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
