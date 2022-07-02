import { ChangeEventHandler, useState } from "react";
import Button from "../../../../components/Button";
import InputBox from "../../../../components/InputBox";
import JsonDisplayer from "../../../../components/JsonDisplayer";
import Core from "./Core";

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

        <JsonDisplayer
          title="To-dos"
          body={{
            1: "add minimum limit",
            2: "fix cursor when 9 -> 10",
            3: "add negative value case",
          }}
        />
      </div>

      <Core
        value={test.value}
        maxValue={test.max}
        onChangeValue={(value) => setTest((prev) => ({ ...prev, value }))}
        testSignal={signal}
      />
    </div>
  );
}
