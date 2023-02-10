import { getRandomInt } from "@Utils/index";
import { useState } from "react";
import type { ICallFakeApiArgs, IUseFakeApiArgs } from "./types";

export const useFakeApi = (options: IUseFakeApiArgs) => {
  const [status, setStatus] = useState("isIdle");
  const [data, setData] = useState<any>();

  const callFakeApi = (args?: ICallFakeApiArgs) => {
    const startTime = Date.now();
    const { dataSchema } = options;
    const { error = "error", isError = false, delay = 1000 } = args || {};
    const response: Record<string, any> = {};

    setStatus("isLoading");

    for (const [field, schema] of Object.entries(dataSchema)) {
      const { count = 1 } = schema;
      const emptyMold = [...Array(count)];

      switch (schema.type) {
        case "number": {
          const results = emptyMold.map(() => getRandomInt(schema.max, schema.min, schema.step));

          response[field] = count === 1 ? results[0] : results;
          break;
        }
        case "string": {
          const results = emptyMold.map(() => {
            return [...Array(schema.len)].reduce((accumulator: string) => {
              const randCharCode = getRandomInt(90, 65);
              const char = String.fromCharCode(randCharCode);

              return accumulator + char;
            }, "") as string;
          });

          response[field] = count === 1 ? results[0] : results;
          break;
        }
      }
    }

    return new Promise((res, rej) => {
      setTimeout(() => {
        if (isError) {
          setStatus("isIdle");
          rej(error);
        } else {
          setStatus("isError");
          setData(response);
          res(response);
        }
      }, delay - Date.now() + startTime);
    });
  };

  return {
    isLoading: status === "isLoading",
    isError: status === "isError",
    data,
    callFakeApi,
  };
};
