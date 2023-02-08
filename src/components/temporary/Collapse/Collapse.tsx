import classNames from "classnames";
import React from "react";
import { Collapse as AntdCollapse } from "antd";
import "./style.scss";

const Collapse = ({ className, ...rest }: React.ComponentProps<typeof AntdCollapse>) => {
  return <AntdCollapse className={classNames("custom-collapse", className)} {...rest} />;
};

Collapse.Panel = AntdCollapse.Panel;

export { Collapse };
