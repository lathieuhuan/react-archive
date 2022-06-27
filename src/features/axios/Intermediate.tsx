import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";

import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";

import { axiosInstance, axiosServiceWithInterceptor } from "./service";

enum Method {
  GET_POST = "get & post",
  USE_INTERCEPTORS = "use interceptors",
  TRANSFORM_REQUEST = "transform request",
  TRANSFORM_RESPONSE = "transform response",
}

const methods = [
  { text: Method.GET_POST, tooltip: "use axios.all" },
  {
    text: Method.USE_INTERCEPTORS,
    tooltip: "log request's config",
  },
  { text: Method.TRANSFORM_REQUEST },
  { text: Method.TRANSFORM_RESPONSE },
];

export default function Intermediate() {
  const [result, setResult] = useState<AxiosResponse>();
  const [error, setError] = useState<string>("");

  const handleError = (error: AxiosError) => {
    setError(error.message);
  };

  const handleClick = (method: Method) => {
    setError("");
    const url = "posts";
    const params = { _limit: 12 };

    switch (method) {
      case Method.GET_POST:
        axios
          .all([
            axiosInstance({
              method: "get",
              url: url,
              params: params,
            }),
            axiosInstance({
              method: "post",
              url: url,
              data: {
                title: "New Post",
                body: "Lorem ipsum dolor sit amet",
                userId: 2,
              },
            }),
          ])
          .then(
            axios.spread((fetchedPost, newPost) => {
              fetchedPost.data.unshift(newPost.data);
              setResult(fetchedPost);
            })
          )
          .catch(handleError);
        break;
      case Method.USE_INTERCEPTORS:
        axiosServiceWithInterceptor({
          method: "put",
          url: url + "/1",
          data: {
            title: "Replace Post",
            body: "Consectetur adipisicing elit",
          },
        })
          .then(setResult)
          .catch(handleError);
        break;
      case Method.TRANSFORM_REQUEST:
        axiosInstance({
          method: "patch",
          url: url + "/1",
          data: {
            body: "Temporibus at quos fugit adipisci delectus?",
          },
          // does not work
          transformRequest: [(data, headers) => {
            data.title = "Transform Title";
            return data;
          }],
        })
          .then((res) => {
            console.log(res);
            setResult(res);
          })
          .catch(handleError);
        break;
      case Method.TRANSFORM_RESPONSE:
        axiosInstance({
          method: "get",
          url: url,
          params: params,
          transformResponse: [
            (data) => {
              return;
            },
          ],
        });
      default:
        return;
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        {methods.map((method) => {
          return (
            <Button
              key={method.text}
              className="capitalize relative group bg-green-600 hover:bg-green-500"
              onClick={() => handleClick(method.text)}
            >
              {method.tooltip && (
                <Tooltip className="normal-case" text={method.tooltip} />
              )}
              {method.text}
            </Button>
          );
        })}
        <span className="place-self-center">url: /posts</span>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result?.data && (
        <div className="w-full py-4 overflow-hidden whitespace-pre">
          <p>{JSON.stringify(result.data, null, 2)}</p>
        </div>
      )}
    </div>
  );
}
