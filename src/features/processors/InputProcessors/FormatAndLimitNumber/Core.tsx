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
  CONFIGS,
  integerToString,
  numberToString,
  stringToNumber,
} from "./utils";

interface UpdateArgs {
  decimal: number | undefined;
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
  onChangeValue?: (value: number) => void;
  testSignal: boolean;
}
export default function Core({
  value,
  maxValue,
  minValue,
  onChangeValue,
  testSignal,
}: CoreProps) {
  //
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const runAfterPaint = useRunAfterPaint();

  useEffect(() => {
    setInputValue(numberToString(minValue || value));
  }, [testSignal]);

  const update = ({
    decimal,
    newValue,
    newInputValue,
    newCursor,
    separatorsRemoved,
    separatorsAdded,
  }: UpdateArgs) => {
    //
    if (decimal !== undefined) {
      // input ends with decimalSeparator
      let decimalPart = CONFIGS.decimalSeparator;
      if (decimal !== 0) {
        decimalPart += decimal;
      }
      newInputValue += decimalPart;
    }

    setInputValue(newInputValue);

    if (onChangeValue) {
      onChangeValue(newValue);
    }

    // update cursor
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
        integer,
        decimal,
        separatorsRemoved,
      } = stringToNumber(value);

      let { result: newInputValue, separatorsAdded } = integerToString(integer);

      if (value === "-") {
        newInputValue = "-";
      }
      // prevent typing "0", if not zero is always there instead of ""
      else if (newInputValue === "0") {
        newInputValue = "";
      }

      update({
        decimal,
        newCursor: e.target.selectionStart,
        newValue,
        newInputValue,
        separatorsRemoved,
        separatorsAdded,
      });
    } catch (error) {
      //
    }
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "0") {
      setInputValue("");
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "") {
      setInputValue(minValue ? numberToString(minValue) : "0");
      return;
    }

    try {
      let { result } = stringToNumber(inputValue);

      if (maxValue !== undefined && result > maxValue) {
        result = maxValue;
      }
      if (minValue !== undefined && result < minValue) {
        result = minValue;
      }

      setInputValue(numberToString(result));

      if (onChangeValue) {
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
    if (value && [KEY.ArrowDown, KEY.ArrowUp].includes(e.key)) {
      e.preventDefault();
      try {
        let {
          result: newValue,
          integer,
          decimal,
          separatorsRemoved,
        } = stringToNumber(value);

        if (e.key === KEY.ArrowUp) {
          integer++;
          newValue++;
        } else if (e.key === KEY.ArrowDown) {
          integer--;
          newValue--;
        }
        const newInputValue = integerToString(integer).result;

        update({
          decimal,
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
