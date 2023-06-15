import { CSSProperties } from "react";

interface INotificationProps {
  type?: "open";
  message: string;
  description: string | object;
  duration?: number;
  style?: CSSProperties;
}
export const showNotify = ({ type = "open", message, description, duration = 0, style = {} }: INotificationProps) => {
  window.alert(message);
  console.log(description);
};

export const numberFormat = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en", options).format(value);
};

export const getRandomInt = (max: number, min: number = 0, step: number = 1) => {
  const diff = (max - min) / step + 1;
  return Math.floor(Math.random() * diff) * step + min;
};
