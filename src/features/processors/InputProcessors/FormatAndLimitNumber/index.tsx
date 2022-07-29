import { ChangeEventHandler, useState } from "react";
import Button from "@Components/Button";
import InputBox from "@Components/InputBox";
import Core from "./Core";

export default function FormatAndLimitNumber() {
  const [test, setTest] = useState({
    value: 0,
    maxValue: 100,
    minValue: 0,
    groupingSeparator: ".",
    decimalSeparator: ",",
    maxFractionalDigits: 1,
    upDownStep: 1
  });
  const [signal, setSignal] = useState(false);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTest((prev) => {
      let { name, value } = e.target;

      return {
        ...prev,
        [name]: ["groupingSeparator", "decimalSeparator"].includes(name) ? value : +value,
      };
    });
  };

  return (
    <div className="flex items-start gap-4">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Test configs</h3>

        <div className="flex justify-between items-center gap-2">
          <label>Value</label>
          <InputBox type="number" name="value" value={test.value} onChange={onChange} />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Maximum</label>
          <InputBox type="number" name="maxValue" value={test.maxValue} onChange={onChange} />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Minimum</label>
          <InputBox type="number" name="minValue" value={test.minValue} onChange={onChange} />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Grouping Separator</label>
          <InputBox
            type="text"
            name="groupingSeparator"
            value={test.groupingSeparator}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Decimal Separator</label>
          <InputBox
            type="text"
            name="decimalSeparator"
            value={test.decimalSeparator}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Max Decimal Digits</label>
          <InputBox
            type="number"
            name="maxFractionalDigits"
            value={test.maxFractionalDigits}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <label>Increase / Decrease Step</label>
          <InputBox
            type="number"
            name="upDownStep"
            value={test.upDownStep}
            onChange={onChange}
          />
        </div>

        <Button onClick={() => setSignal((prev) => !prev)}>Begin Testing</Button>
      </div>

      <Core
        {...test}
        changeMode="onBlur"
        // exceedMaxDigitsAction="round"
        testSignal={signal}
        onChangeValue={(value) => setTest((prev) => ({ ...prev, value }))}
      />
    </div>
  );
}
