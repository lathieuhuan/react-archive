import { Control, ControllerProps, Path, FieldValues } from "react-hook-form";

export type FormData = {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: "MALE" | "FEMALE" | "OTHER";
  occupation: string;
  yoe?: number;
  socialMedias: Array<{
    type: "FACEBOOK" | "INSTAGRAM";
    link: string;
  }>;
};

export type FormItemProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  control: Control<T, any>;
  rules?: ControllerProps["rules"];
};
