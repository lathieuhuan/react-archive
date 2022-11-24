import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import JsonDisplayer from "@Components/JsonDisplayer";
import { axiosInstance } from "./service";

const METHODS = ["get", "post", "put", "patch", "delete"] as const;

export default function Basic() {
  const [result, setResult] = useState<AxiosResponse>();
  const [error, setError] = useState<string>("");

  const handleError = (error: AxiosError) => {
    setError(error.message);
  };

  const handleClick = async (method: typeof METHODS[number]) => {
    setError("");
    const url = "posts";
    const params = { _limit: 8 };
    let args = { method, url } as AxiosRequestConfig;

    switch (method) {
      case "get":
        args.params = params;
        break;
      case "post":
        args.data = {
          title: "New Post",
          body: "Lorem ipsum dolor sit amet",
          userId: 2,
        };
        break;
      case "put":
        args.url += "/1";
        args.data = {
          title: "Replace Post",
          body: "Consectetur adipisicing elit",
        };
        break;
      case "patch":
        args.url += "/1";
        args.data = {
          title: "Updated Post",
          body: "Temporibus at quos fugit adipisci delectus?",
        };
        break;
      case "delete":
        args.url += "/1";
        break;
      default:
        return;
    }
    axiosInstance(args).then(setResult).catch(handleError);
  };

  return (
    <div>
      <div className="flex gap-2">
        {METHODS.map((method) => {
          return (
            <button
              key={method}
              className="button button-primary capitalize"
              onClick={() => handleClick(method)}
            >
              {method}
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 flex flex-col gap-4">
          <JsonDisplayer title="Headers" body={result.headers} />
          <JsonDisplayer
            title="Data"
            body={result.data}
            bodyStyle={{ maxHeight: "600px", overflow: "auto" }}
          />
          <JsonDisplayer title="Config" body={result.config} />
        </div>
      )}
    </div>
  );
}
