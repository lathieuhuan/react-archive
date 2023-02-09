import cls from "classnames";
import React from "react";
import { Collapse as AntdCollapse } from "antd";
import "./style.scss";

const Collapse = (props: React.ComponentProps<typeof AntdCollapse>) => {
  return <AntdCollapse {...props} className={cls("voucher-custom-collapse", props.className)} />;
};

Collapse.Panel = AntdCollapse.Panel;

export { Collapse };
