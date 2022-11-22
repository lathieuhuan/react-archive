import { useState } from "react";

interface ICallFakeApiArgs {
  response?: any;
  error?: any;
  delay?: number;
  isError?: boolean;
}
export const useFakeApi = () => {
  const [status, setStatus] = useState("idle");

  const callFakeApi = (args?: ICallFakeApiArgs) => {
    const { response = "ok", error = "error", isError = false, delay = 1000 } = args || {};

    setStatus("loading");

    return new Promise((res, rej) => {
      setTimeout(() => {
        if (isError) {
          rej(error);
        } else {
          setStatus("idle");
          res(response);
        }
      }, delay);
    });
  };

  return {
    isLoading: status === "loading",
    callFakeApi,
  };
};
