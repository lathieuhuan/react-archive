import { FieldError } from "react-hook-form";

export const ErrorMsg = ({ error }: { error?: FieldError }) =>
  error?.message ? <p className="mt-2 text-red-500">{error.message}</p> : null;
