import { HighForm } from "@Components/HighForm";
import { checkAndDisableV1 } from "@Components/HighForm/trials/ver1";
import { Button, Form, Select } from "antd";
import React, { useEffect, useState } from "react";

const { Checkbox, Input } = HighForm;

type MyForm = {
  isA: boolean;
  isB: boolean;
  isC: boolean;
  name: string;
  dob: string;
};

export const AntdForm: React.FC = () => {
  const [form] = Form.useForm<MyForm>();
  const [disables, setDisables] = useState<Partial<Record<keyof MyForm, boolean[]>>>({});

  const onFinish = (values: any) => {
    console.log(values);
  };

  const checkAndDisable = (changedValues: Partial<MyForm>, values: MyForm) => {
    checkAndDisableV1(disables, setDisables)(changedValues, values);
  };

  useEffect(() => {
    const fieldsValue = form.getFieldsValue();

    checkAndDisable(fieldsValue, fieldsValue);
  }, []);

  return (
    <HighForm
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      name="control-hooks"
      onValuesChange={checkAndDisable}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Checkbox name="isA" label="Is A" rules={[{ required: true }]} />

      <Checkbox name="isB" label="Is B" rules={[{ required: true }]} />

      <Checkbox name="isC" label="Is C" rules={[{ required: true }]} />

      {/* <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
        {({ getFieldValue }) =>
          getFieldValue("gender") === "other" ? (
            <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item> */}

      <Input name="name" label="Name" disabled={disables.name?.some(Boolean)} />

      <Input name="dob" label="DoB" disabled={disables.dob?.some(Boolean)} />

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" className="bg-blue-400" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </HighForm>
  );
};
