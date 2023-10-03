import "@Components/WebComponentCard";
import { useMockApi, useLogger } from "@Src/hooks";
import { useEffect } from "react";

export const WebComponents = () => {
  const { isLoading, data, callMockApi } = useMockApi({
    dataSchema: {
      code: {
        type: "string",
        len: 8,
      },
      stock: {
        type: "number",
        max: 1000,
      },
    },
  });
  const { log, renderLogger } = useLogger({ title: "Mock Api" });

  useEffect(() => {
    if (data) {
      log(Object.entries(data).map(([key, value]) => `${key} - ${value}`));
    }
  }, [data]);

  return (
    <div className="space-y-4">
      <p>You expect Web Component, but it's me, useMockApi! And me useLogger!</p>

      <button className="button button-primary" onClick={() => callMockApi()}>
        Fetch
      </button>

      {isLoading && <p>Loading...</p>}

      {renderLogger()}
    </div>
  );
  //   return <web-comp-card name="John" />;
};
