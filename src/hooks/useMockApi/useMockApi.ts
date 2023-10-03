import { getRandomInt } from "@Utils/index";
import { useState } from "react";
import type { ICallMockApiArgs, IUseMockApiArgs } from "./types";

type TStatus = "IDLE" | "ERROR" | "LOADING";

export function useMockApi<T extends string>(options: IUseMockApiArgs<T>) {
  const [status, setStatus] = useState<TStatus>("IDLE");
  const [data, setData] = useState<Record<T, any>>();

  const callMockApi = (args?: ICallMockApiArgs): Promise<Record<T, any>> => {
    const startTime = Date.now();
    const { dataSchema, delay: defaultDelay = 1000 } = options;
    const { error = "error", isError = false, delay = defaultDelay } = args || {};
    const response: Record<string, any> = {};

    setStatus("LOADING");

    for (const field in dataSchema) {
      const schema = dataSchema[field];
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
          setStatus("IDLE");
          rej(error);
        } else {
          setStatus("ERROR");
          setData(response);
          res(response);
        }
      }, delay - Date.now() + startTime);
    });
  };

  return {
    isLoading: status === "LOADING",
    isError: status === "ERROR",
    data,
    callMockApi,
  };
}
