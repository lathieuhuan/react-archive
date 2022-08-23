import Button from "@Src/components/Button";
import InputBox from "@Src/components/InputBox";
import JsonDisplayer from "@Src/components/JsonDisplayer";
import { useInputNumber } from "@Src/hooks/useInputNumber";
import classNames from "classnames";
import { useState } from "react";

const sectionStyle = "mt-4 p-4 rounded-lg border border-slate-300 break-inside-avoid-column";

export default function UseInputNumberExamples() {
  return (
    <div className="columns-2">
      <MostBasic />
      <Basic />
      <MultipleInputsBasic />
      <MultipleDynamicInputs />
    </div>
  );
}

function MostBasic() {
  const { value, register } = useInputNumber();

  return (
    <div className={classNames("flex flex-col", sectionStyle, "mt-0")}>
      <p className="font-bold text-lg text-red-500">Most basic</p>
      <p className="text-slate-700 text-sm">One input. No config (use default). No validation. No extra useState.</p>

      <p className="mt-2 text-blue-500 font-medium">Behaviors:</p>
      <ul className="pl-5 list-disc list-outside">
        <li>
          Not pass value to register ={">"} Start with value undefined, inputValue empty. Once enter some input, value
          cannot return to undefined.
        </li>
      </ul>

      <InputBox className="mt-4" placeholder="Enter some input..." {...register()} />
      <p className="mt-4 font-medium text-right">{value} :Value</p>
    </div>
  );
}

function Basic() {
  const { value, register } = useInputNumber({
    changeMode: "onBlur",
  });

  const validate = {
    maxValue: 10000,
    minValue: -1000,
  };

  return (
    <div className={classNames("flex flex-col", sectionStyle)}>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-lg text-red-500">With config and validate</p>
        <JsonDisplayer title="Config" />
        <JsonDisplayer title="Validate" body={validate} />
      </div>

      <InputBox className="mt-4" placeholder="Enter some input..." {...register(validate)} />
      <p className="mt-4 font-medium text-right">{value} :Value</p>
    </div>
  );
}

function MultipleInputsBasic() {
  const { value, values, register } = useInputNumber();

  return (
    <div className={sectionStyle}>
      <p className="font-bold text-lg text-red-500">Multiple inputs</p>
      <p className="text-slate-700 text-sm">Each input should have a unique name.</p>

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
              <div className="flex gap-3">
                <InputBox
                  key={input.id}
                  className="grow"
                  placeholder={"Enter input id " + input.id}
                  {...register({ name: "input" + i })}
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