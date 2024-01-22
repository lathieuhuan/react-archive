import { useState } from "react";
import { HistoryLog, HistoryLogProps } from "@Components/HistoryLog";
import { useMockApi } from "@Src/hooks";

export const HistoryLogPage = () => {
  const [loading, setLoading] = useState(true);
  // const { isLoading, data } = useMockApi({
  //   dataSchema: {
  //     id: {
  //       type: "number",
  //       min: 10000,
  //       max: 99999,
  //     },
  //     content: {
  //       type: "string",
  //       len: 10,
  //     },
  //   },
  //   delay: 500,
  // });

  const records: HistoryLogProps["records"] = [
    {
      id: 10001,
      content: "Content A",
    },
    {
      id: 10201,
      content: "Content B",
    },
    {
      id: 10046,
      content: "Content C",
    },
    {
      id: 19873,
      content: "Content D",
    },
  ];

  return (
    <div>
      <div>
        <button className="mb-4 button button-primary" onClick={() => setLoading(!loading)}>
          Stop loading
        </button>
      </div>

      <HistoryLog loading={loading} records={records} />
    </div>
  );
};
