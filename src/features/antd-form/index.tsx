import { HighForm } from "@Components/HighForm";
import { Button, Form } from "antd";
import React from "react";

const { Checkbox, Input, Group } = HighForm;

export const AntdForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="p-4" style={{ background: "#F5F5F5" }}>
      <HighForm
        className="space-y-4"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="demo"
        onFinish={onFinish}
        initialActiveGroupKeys="1"
        style={{ maxWidth: 600 }}
      >
        <Group headerText="Header" groupKey="1">
          <p>Hello World</p>
        </Group>

        <Group headerText="Header 2" groupKey="2">
          <p>Hello World 2</p>
          <Checkbox name="isA" label="Is A" rules={[{ required: true }]} />
        </Group>

        <Group headerText="Header 3" groupKey="3">
          <p>Hello World 3</p>
        </Group>

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

        <Input name="dob" label="DoB" />

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" className="bg-blue-400" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </HighForm>
    </div>
  );
};
