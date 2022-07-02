import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import InputBox from "../../../../components/InputBox";
import { KEY } from "../../../../constant";
import {
  CONFIGS,
  integerToString,
  numberToString,
  stringToNumber,
} from "../utils";

interface UpdateArgs {
  decimal: number | undefined;
  newValue: number;
  newInputValue: string;
  newCursor: number | null;
  separatorsRemoved: number;
  separatorsAdded: number;
}

interface ProcessAndDisplayProps {
  value: number;
  maxValue?: number;
  onChangeValue?: (value: number) => void;
  testSignal: boolean;
}
export default function Core({
  value,
  maxValue,
  onChangeValue,
  testSignal,
}: ProcessAndDisplayProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const runAfterPaint = useRunAfterPaint();

  useEffect(() => {
    setInputValue(numberToString(value));
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
    if (decimal) {
      newInputValue += CONFIGS.decimalSeparator + decimal;
    }

    setInputValue(newInputValue);

    if (onChangeValue) {
      onChangeValue(newValue);
    }

    runAfterPaint(() => {
      if (newCursor !== null) {
        newCursor = newCursor - separatorsRemoved + separatorsAdded;
        inputRef.current?.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      const {
        result: newValue,
        integer,
        decimal,
        separatorsRemoved,
      } = stringToNumber(e.target.value);

      let { result: newInputValue, separatorsAdded } = integerToString(integer);

      if (newInputValue === "0") {
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
      console.log(error);
    }
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    if (inputValue === "0") {
      setInputValue("");
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (inputValue === "") {
      setInputValue("0");
      return;
    }

    try {
      const { result } = stringToNumber(inputValue);

      if (maxValue !== undefined && (isNaN(result) || result > maxValue)) {
        setInputValue(numberToString(maxValue));

        if (onChangeValue) {
          onChangeValue(maxValue);
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
        let { result: newInputValue, separatorsAdded } =
          integerToString(integer);

        update({
          decimal,
          newCursor: e.currentTarget.selectionStart,
          newValue,
          newInputValue,
          separatorsRemoved,
          separatorsAdded,
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
