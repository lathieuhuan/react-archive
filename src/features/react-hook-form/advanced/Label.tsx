import { ControllerProps } from "react-hook-form";

type LabelProps = {
  children: React.ReactNode;
  rules?: ControllerProps["rules"];
};
export function Label(props: LabelProps) {
  const { required } = props.rules || {};
  const isRequired =
    required !== undefined &&
    (typeof required === "string" ? true : typeof required === "boolean" ? required : required.value);

  return (
    <label className="mb-1">
      {isRequired ? <span className="text-red-500">* </span> : null}
      {props.children}
    </label>
  );
}
