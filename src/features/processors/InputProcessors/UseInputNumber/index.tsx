import classNames from "classnames";
import { useState } from "react";

import { IUseInputNumberArgs, useInputNumber } from "@Src/hooks/useInputNumber";

import Button from "@Src/components/Button";
import InputBox from "@Src/components/InputBox";
import JsonDisplayer from "@Src/components/JsonDisplayer";
import { ConnectToStateTemplate } from "./template";

const sectionStyle = "mt-4 p-4 rounded-lg border border-slate-200 break-inside-avoid-column";

export default function UseInputNumberExamples() {
  return (
    <div className="columns-2">
      <div className={classNames("space-y-2", sectionStyle, "mt-0")}>
        <Basic />
        <BasicWithConfigAndValidate />
      </div>

      <MultipleInputsBasic />

      <div className={classNames("space-y-2", sectionStyle)}>
        <ConnectToState />
      </div>

      <MultipleDynamicInputs />
    </div>
  );
}

function Basic() {
  const { value, register } = useInputNumber({
    enterActions: {
      blur: true,
    },
    focusActions: {
      selectAll: true,
      clearZero: true,
    },
    allowEmpty: true,
  });

  return (
    <div className="flex flex-col">
      <p className="font-bold text-lg text-red-500">Basic</p>
      <p className="text-slate-600 text-sm">One input. No config (use default). No validation. No need useState.</p>

      <p className="mt-2 text-blue-500 font-medium">Behaviors:</p>
      <ul className="pl-5 list-disc list-outside">
        <li>The hook returns value.</li>
        <li>Start with value undefined, inputValue empty. Once enter some input, value cannot return to undefined.</li>
      </ul>

      <InputBox className="mt-4" placeholder="Enter some input..." {...register()} />
      <p className="mt-4 font-medium text-right">{value === undefined ? "(undefined)" : value} :Value</p>
    </div>
  );
}

function BasicWithConfigAndValidate() {
  const config: IUseInputNumberArgs = {
    changeMode: "onBlur",
    validateMode: "onChangeSetBack",
  };
  const validate = {
    maxValue: 10000000,
    minValue: -10000000,
    maxFractionDigits: 5,
  };

  const { value, register } = useInputNumber(config);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-bold text-lg text-red-500">With config and validate</p>
        </div>
        <JsonDisplayer title="Config" body={config} />
        <JsonDisplayer title="Validate" body={validate} />
      </div>

      <InputBox className="mt-4" placeholder="Enter some input..." {...register(validate)} />
      <p className="mt-4 font-medium text-right">{value === undefined ? "(undefined)" : value} :Value</p>
    </div>
  );
}

function MultipleInputsBasic() {
  const { value, values, register } = useInputNumber();

  return (
    <div className={sectionStyle}>
      <p className="font-bold text-lg text-red-500">Multiple inputs</p>
      <p className="text-slate-600 text-sm">Each input should have a unique name.</p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <InputBox placeholder="Enter valueA" {...register({ name: "valueA" })} />
        <InputBox placeholder="Enter valueB" {...register({ name: "valueB" })} />
      </div>

      <p className="mt-2 text-red-500 font-medium">Behaviors:</p>
      <ul className="pl-5 list-disc list-outside">
        <li>Inputs registered with the same name are treated as one.</li>
        <li>Inputs registered with no name are also treated as one. Their value is 'value' or 'values.undefined'</li>
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <InputBox placeholder="Enter valueC" {...register({ name: "valueC" })} />
        <InputBox placeholder="Enter valueC" {...register({ name: "valueC" })} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <InputBox placeholder="Registered with no name" {...register()} />
        <InputBox placeholder="Registered with no name" {...register()} />
      </div>

      <JsonDisplayer className="mt-4" title="Values" body={values} />
      <p className="mt-4 font-medium text-right">{value} :Value</p>
    </div>
  );
}

function ConnectToState() {
  const [valueA, setValueA] = useState(0);
  const [valueB, setValueB] = useState(0);
  const [valueC, setValueC] = useState(0);
  const { register } = useInputNumber({ validateMode: "onChangePrevent" });

  const { onChange, ...rest } = register({ name: "inputB", minValue: -1000000 });

  console.log(valueC);

  return (
    <div className="flex flex-col">
      <p className="font-bold text-lg text-red-500">Connect to State</p>

      <ConnectToStateTemplate
        desc="Pass a callback as onChangeValue in register config"
        label="Input A"
        value={valueA}
        input={
          <InputBox
            className="grow"
            placeholder="Enter some input..."
            {...register({
              name: "inputA",
              onChangeValue: setValueA,
            })}
          />
        }
      />

      <ConnectToStateTemplate
        desc="Or use value returned by onChange returned by register"
        label="Input B"
        value={valueB}
        input={
          <InputBox
            className="grow"
            placeholder="Enter some input..."
            onChange={(e) => {
              const newValue = onChange(e);
              if (newValue !== undefined) {
                setValueB(newValue);
              }
            }}
            {...rest}
          />
        }
      />

      <ConnectToStateTemplate
        desc="Pass the value to register to update inputValue when a third party change the value. (maxValue: 1000)"
        label="Input C"
        value={valueC}
        input={
          <InputBox
            className="grow"
            placeholder="Enter some input..."
            {...register({
              name: "inputC",
              value: valueC,
              maxValue: 1000,
              onChangeValue: setValueC,
            })}
          />
        }
      />
      <div className="mt-2 px-4 flex gap-2">
        <Button
          className="shrink-0 bg-orange-500 hover:bg-orange-400 text-xl font-bold"
          onClick={() => setValueC(valueC - 1)}
        >
          -
        </Button>
        <Button className="grow" onClick={() => setValueC(valueB)}>
          Change valueC to the same as valueB
        </Button>
        <Button
          className="shrink-0 bg-orange-500 hover:bg-orange-400 text-xl font-bold"
          onClick={() => setValueC(valueC + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}

function MultipleDynamicInputs() {
  const [inputs, setInputs] = useState<Array<{ id: number }>>([]);
  const { values, register } = useInputNumber();

  return (
    <div className={classNames("flex flex-col gap-4", sectionStyle)}>
      <p className="font-bold text-lg text-red-500">Multiple dynamic inputs</p>

      {inputs.length ? (
        <div className="flex flex-col gap-4">
          {inputs.map((input, i) => {
            return (
              <div key={input.id} className="flex gap-3">
                <InputBox
                  className="grow"
                  placeholder={"Enter input id " + input.id}
                  {...register({ name: "input-" + input.id })}
                />
                <button
                  className="px-4 bg-red-200 text-red-500 text-xl font-bold rounded"
                  onClick={() =>
                    setInputs((prev) => {
                      const newInputs = [...prev];
                      newInputs.splice(i, 1);
                      return newInputs;
                    })
                  }
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      <Button
        className="w-full bg-green-200 text-green-600 hover:bg-green-300 hover:text-green-600 text-lg font-bold flex justify-center items-center"
        onClick={() => setInputs((prev) => [...prev, { id: Date.now() }])}
      >
        Add
      </Button>

      <JsonDisplayer title="Values" body={values} />
    </div>
  );
}
