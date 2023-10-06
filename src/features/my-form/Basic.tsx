import InputBox from "@Components/InputBox";
import { Form, Path } from "@Components/Maudon";

type FormData = {
  primitive: string;
  nested: {
    value: string;
  };
  object: {
    key: string;
  };
};

type FieldProps = {
  label: string;
  children: React.ReactNode;
};
const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-col">
      <label>{props.label}</label>
      {props.children}
    </div>
  );
};

type ObjectInputProps = {
  value?: FormData["object"];
  onChange?: (object: FormData["object"]) => void;
};
const ObjectInput = ({ value, onChange }: ObjectInputProps) => {
  return (
    <InputBox
      value={value?.key}
      onChange={(e) => {
        onChange?.({
          key: e.target.value,
        });
      }}
    />
  );
};

function TestUseWatch({ path }: { path: Path<FormData> }) {
  const form = Form.useFormCenter<FormData>();
  const value = Form.useWatch(form, path);

  console.log("TestUseWatch", path);

  return (
    <div>
      <p>Watched {path}</p>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

export function MyFormBasic() {
  const form = Form.useForm<FormData>({
    defaultValues: {
      code: "",
    },
  });

  const handleClick = () => {
    // form.setValue("nested", { value: "DEV" }); // Not work, no watcher for "nested", only for "nested.value", improve?
    // form.setValue("object", { key: "DEV" });
  };

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form.Item form={form} name="primitive">
        {({ control }) => {
          return (
            <Field label="Code">
              <InputBox {...control} />
            </Field>
          );
        }}
      </Form.Item>
      <TestUseWatch path="primitive" />

      <Form.Item form={form} name="nested.value">
        {({ control }) => {
          return (
            <Field label="Nested Value">
              <InputBox {...control} />
            </Field>
          );
        }}
      </Form.Item>
      <TestUseWatch path="nested.value" />

      <Form.Item form={form} name="object">
        {({ control }) => {
          return (
            <Field label="Object Input">
              <ObjectInput {...control} />
            </Field>
          );
        }}
      </Form.Item>
      <TestUseWatch path="object" />

      <div className="flex space-x-4">
        <button type="button" className="button button-primary" onClick={handleClick}>
          Click
        </button>
        <button type="submit" className="button button-primary">
          Submit
        </button>
      </div>
    </Form>
  );
}
