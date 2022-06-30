import { Resolver } from "react-hook-form";
import { UseControllerFormData } from "./types";

const customResolver: Resolver<UseControllerFormData> = (
  values,
  _context,
  options
) => {
  console.log("values");
  console.log(values);
  console.log("_context");
  console.log(_context);
  console.log("options");
  console.log(options);

  return { values, errors: {} };
};

export default customResolver;
