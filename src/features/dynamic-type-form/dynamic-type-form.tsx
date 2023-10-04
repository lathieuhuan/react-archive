import { useState } from "react";
import { genForm } from "@Components/Form";
import InputBox from "@Components/InputBox";

interface FormData {
  code: string;
  stock: number;
}

export const DynamicTypeForm = () => {
  const { FormItem, getFormProps } = genForm<FormData>({
    //   onSubmit: console.log,
  });
  // const [count, setCount] = useState(0);

  return (
    <div>
      <p className="mb-4 text-red-700">This is Experimental</p>

      <form {...getFormProps({ onSubmit: console.log })}>
        <FormItem name="code" validate={(value) => (value ? true : "Required")}>
          {(args) => {
            return (
              <div>
                <InputBox onChange={(e) => args.onChange(e.target.value)} />
                <p className="text-red-700">{args.error}</p>
              </div>
            );
          }}
        </FormItem>

        <FormItem name="stock">
          {(args) => {
            return <InputBox onChange={(e) => args.onChange(+e.target.value)} />;
          }}
        </FormItem>

        <button className="button button-primary">Submit</button>
      </form>

      {/* <button onClick={() => setCount(count + 1)}>Click</button> */}
    </div>
  );
};
