import { notification } from "antd";

interface INotificationProps {
  type?: "open";
  message: string;
  description: string | object;
  duration?: number;
}

export const showNotify = ({
  type = "open",
  message,
  description,
  duration = 0,
}: INotificationProps) => {
  notification[type]({
    message: <p className="text-blue-700 font-semibold">{message}</p>,
    description: (
      <p className="text-base leading-7">
        {typeof description === "object"
          ? JSON.stringify(description)
          : description}
      </p>
    ),
    duration,
    style: {
      borderRadius: "0.5rem",
    },
  });
};
