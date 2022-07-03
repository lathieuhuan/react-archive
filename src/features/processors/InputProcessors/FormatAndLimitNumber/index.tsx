import { ChangeEventHandler, useState } from "react";
import Button from "../../../../components/Button";
import InputBox from "../../../../components/InputBox";
import Core from "./Core";

export default function FormatAndLimitNumber() {
  const [test, setTest] = useState({
    value: 0,
    max: 3,
    min: 0
  });
  const [signal, setSignal] = useState(false);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTest((prev) => ({ ...prev, [e.target.name]: +e.target.value }));
  };

  return (
    <div className="flex items-start gap-4">
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

        <div className="flex justify-between items-center gap-2">
          <label>Minimum</label>
          <InputBox
            type="number"
            name="min"
            value={test.min}
            onChange={onChange}
          />
        </div>

        <Button onClick={() => setSignal((prev) => !prev)}>
          Pass value down again
        </Button>
      </div>

      <Core
        value={test.value}
        maxValue={test.max}
        minValue={test.min}
        onChangeValue={(value) => setTest((prev) => ({ ...prev, value }))}
        testSignal={signal}
      />
    </div>
  );
}
