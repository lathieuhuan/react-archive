import React from "react";
import { HighForm } from "@Components/HighForm";
import { Button, Form } from "antd";

const { Checkbox, Input, Group } = HighForm;

export const AntdForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="p-4" style={{ background: "#F5F5F5" }}>
      <HighForm
        className="space-y-4"
        name="demo"
        layout="vertical"
        initialActiveGroupKeys="1"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Group header="Header" groupKey="1" cols={2}>
          <Input name="warehouseCode" label="Ma kho" placeholder="Nhap" required />
        </Group>

        <Group header="Header 2" groupKey="2">
          <p>Hello World 2</p>
          <Checkbox name="isA" label="Is A" rules={[{ required: true }]} />
        </Group>

        <Group header="Header 3" groupKey="3">
          <p>Hello World 3</p>
        </Group>

        <Checkbox name="isB" label="Is B" rules={[{ required: true }]} />

        <Checkbox name="isC" label="Is C" rules={[{ required: true }]} />

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" className="bg-blue-400" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </HighForm>
    </div>
  );
};
