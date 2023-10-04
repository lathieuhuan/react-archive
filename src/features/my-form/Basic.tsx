import { Form } from "@Components/Maudon";

export function MyFormBasic() {
  const form = Form.useForm({
    defaultValues: {
      code: "",
    },
  });

  return (
    <Form>
      <Form.Item name="code">
        <input />
      </Form.Item>
    </Form>
  );
}
