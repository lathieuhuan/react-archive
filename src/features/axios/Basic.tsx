import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";

import Button from "../../components/Button";

import { METHODS } from "./constant";
import { axiosInstance } from "./service";

export default function Basic() {
  const [result, setResult] = useState<AxiosResponse>();
  const [error, setError] = useState<string>("");

  const handleError = (error: AxiosError) => {
    setError(error.message);
  };

  const handleClick = async (method: typeof METHODS[number]) => {
    setError("");
    const url = "posts";
    const params = { _limit: 12 };
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
            <Button
              key={method}
              className="capitalize"
              onClick={() => handleClick(method)}
            >
              {method}
            </Button>
          );
        })}
        <span className="place-self-center">url: /posts</span>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result?.data && (
        <div className="w-full py-4 overflow-auto custom-scrollbar whitespace-pre">
          <p>{JSON.stringify(result.data, null, 2)}</p>
        </div>
      )}
    </div>
  );
}
