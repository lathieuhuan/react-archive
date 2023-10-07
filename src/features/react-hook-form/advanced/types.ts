import { Control, ControllerProps, Path, FieldValues } from "react-hook-form";

export type FormData = {
  formInput: string;
  formInputNumber: number;
  formRadio: "RADIO_A" | "RADIO_B" | "RADIO_C";
  formSelect: "OPTION_A" | "OPTION_B" | "OPTION_C";
  dummy1: string;
  dummy2: string;
  dummy3: string;
  // dob: Date;
  socialMedias: Array<{
    type: "FACEBOOK" | "INSTAGRAM";
    link: string;
  }>;
};

export type FormItemProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  rules?: ControllerProps["rules"];
};
