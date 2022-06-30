import {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useState
} from "react";
import Button from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import {
  CONFIGS,
  integerToString,
  numberToString, stringToNumber
} from "./utils";

export default function FormatAndLimitNumber() {
  const [test, setTest] = useState({
    value: 0,
    max: 3,
  });
  const [signal, setSignal] = useState(false);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTest((prev) => ({ ...prev, [e.target.name]: +e.target.value }));
  };

  return (
    <div className="flex gap-4">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Test configs</h3>

        <div className="flex justify-between items-center gap-2">
          <label>Value</label>
          <InputBox
            type="number"
            name="value"
            value={test.value}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Maximum</label>
          <InputBox
            type="number"
            name="max"
            value={test.max}
            onChange={onChange}
          />
        </div>

        <Button onClick={() => setSignal((prev) => !prev)}>
          Pass value down again
        </Button>
      </div>

      <ProcessAndDisplay
        value={test.value}
        maxValue={test.max}
        onChangeValue={(value) => setTest((prev) => ({ ...prev, value }))}
        testSignal={signal}
      />
    </div>
  );
}

interface ProcessAndDisplayProps {
  value: number;
  maxValue?: number;
  onChangeValue?: (value: number) => void;
  testSignal: boolean;
}
function ProcessAndDisplay({
  value,
  maxValue,
  onChangeValue,
  testSignal,
}: ProcessAndDisplayProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(numberToString(value));
  }, [testSignal]);

  const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      const [newValue, integer, decimal] = stringToNumber(e.target.value);

      if (onChangeValue) {
        onChangeValue(newValue);
      }

      let newInputValue = integerToString(integer);

      if (decimal !== undefined) {
        let decimalPart = CONFIGS.decimalSeparator;
        if (decimal !== 0) {
          decimalPart += decimal;
        }
        newInputValue += decimalPart;
      }
      if (newInputValue === "0") {
        newInputValue = "";
      }
      setInputValue(newInputValue);
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
      setInputValue("0");
      return;
    }

    try {
      const [valueAsNumber] = stringToNumber(inputValue);

      if (
        maxValue !== undefined &&
        (isNaN(valueAsNumber) || valueAsNumber > maxValue)
      ) {
        setInputValue(numberToString(maxValue));
        
        if (onChangeValue) {
          onChangeValue(maxValue);
        }
      }
    } catch (error) {
      //
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label>Input</label>
      <InputBox
        value={inputValue}
        onChange={onChangeInputValue}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
