import { notification } from "antd";
import { CSSProperties, useState } from "react";

interface INotificationProps {
  type?: "open";
  message: string;
  description: string | object;
  duration?: number;
  style?: CSSProperties;
}
export const showNotify = ({ type = "open", message, description, duration = 0, style = {} }: INotificationProps) => {
  notification[type]({
    message: <p className="text-blue-700 font-semibold">{message}</p>,
    description: (
      <p className="text-base leading-7">
        {typeof description === "object" ? JSON.stringify(description, null, 2) : description}
      </p>
    ),
    duration,
    style: {
      borderRadius: "0.5rem",
      ...style,
    },
  });
};

export const numberFormat = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en", options).format(value);
};
