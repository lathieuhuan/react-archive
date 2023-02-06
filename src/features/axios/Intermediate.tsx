import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import JsonDisplayer from "@Components/JsonDisplayer";
import Tooltip from "@Components/Tooltip";
import { axiosInstance, axiosServiceWithInterceptor } from "./service";

enum Method {
  GET_POST = "get & post",
  USE_INTERCEPTORS = "use interceptors",
  TRANSFORM_REQUEST = "transform request",
  TRANSFORM_RESPONSE = "transform response",
  WITH_TIMEOUT = "with timeout",
  VALIDATE_STATUS = "validate status",
  CANCEL_REQUEST = "cancel request",
}

const methods = [
  { text: Method.GET_POST, tooltip: "use axios.all" },
  {
    text: Method.USE_INTERCEPTORS,
    tooltip: "log request's config and response",
  },
  { text: Method.TRANSFORM_REQUEST },
  { text: Method.TRANSFORM_RESPONSE },
  { text: Method.WITH_TIMEOUT },
  {
    text: Method.VALIDATE_STATUS,
    tooltip: "decide which status will be caught as error",
  },
  { text: Method.CANCEL_REQUEST },
];

export const Intermediate = () => {
  const [result, setResult] = useState<AxiosResponse>();
  const [error, setError] = useState<string>("");
  const [isCanceled, setIsCanceled] = useState(true);

  const handleError = (error: AxiosError) => {
    setError(error.message);
  };

  const handleClick = (method: Method) => {
    setError("");
    const url = "posts";
    const params = { _limit: 8 };
    const defaultConfigForGet = {
      method: "get",
      url: url,
      params: params,
    };

    switch (method) {
      case Method.GET_POST:
        axios
          .all([
            axiosInstance(defaultConfigForGet),
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
          // need to set headers
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            title: "Normal title",
            body: "Temporibus at quos fugit adipisci delectus?",
          },
          transformRequest: [
            (data, headers) => {
              data.title = "Transformed title";
              return JSON.stringify(data);
            },
          ],
        })
          .then(setResult)
          .catch(handleError);
        break;
      case Method.TRANSFORM_RESPONSE:
        axiosInstance({
          ...defaultConfigForGet,
          transformResponse: [
            (data) => {
              const results = JSON.parse(data);
              results.unshift({ desc: "Injected by transformResponse" });
              return results;
            },
          ],
        })
          .then(setResult)
          .catch(handleError);
        break;
      case Method.CANCEL_REQUEST:
        const source = axios.CancelToken.source();
        axiosInstance({
          ...defaultConfigForGet,
          cancelToken: source.token,
        })
          .then(setResult)
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("Cancel message: ", err.message);
            }
            handleError(err);
          });
        if (isCanceled) {
          source.cancel();
        }
        break;
      case Method.WITH_TIMEOUT:
        axiosInstance({
          ...defaultConfigForGet,
          timeout: 5, // ms
        })
          .then(setResult)
          .catch(handleError);
        break;
      case Method.VALIDATE_STATUS:
        axiosInstance({
          ...defaultConfigForGet,
          url: defaultConfigForGet.url + "err",
          validateStatus: (status) => {
            return status < 500;
            // responses with status < 500 will trigger then(), others trigger catch()
          },
        })
          .then(setResult)
          .catch(handleError);
        break;
      default:
        return;
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        {methods.map((method) => {
          return (
            <button
              key={method.text}
              className="button capitalize relative group bg-green-600 hover:bg-green-500 text-white"
              onClick={() => handleClick(method.text)}
            >
              {method.tooltip && <Tooltip className="normal-case" text={method.tooltip} />}
              {method.text}
            </button>
          );
        })}
        <label className="ml-2 flex items-center">
          <input
            type="checkbox"
            className="mr-2 scale-125"
            checked={isCanceled}
            onChange={() => setIsCanceled((prev) => !prev)}
          />
          Cancel Request
        </label>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 flex flex-col gap-4">
          <JsonDisplayer title="Headers" body={result.headers} />
          <JsonDisplayer title="Data" body={result.data} bodyStyle={{ maxHeight: "600px", overflow: "auto" }} />
          <JsonDisplayer title="Config" body={result.config} />
        </div>
      )}
    </div>
  );
};
