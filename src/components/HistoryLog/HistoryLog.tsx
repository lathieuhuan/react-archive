import { useEffect, useState } from "react";
import "./styles.scss";

type Version = {
  id: number | string;
  content: string;
};

export interface HistoryLogProps {
  loading?: boolean;
  records: Version[];
}

export const HistoryLog = (props: HistoryLogProps) => {
  const [active, setActive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  const isLoading = loading || props.loading;
  const count = isLoading ? 3 : props.records.length;

  useEffect(() => {
    setTimeout(() => {
      setStarted(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setActive(true);

      setTimeout(() => {
        setConnected(true);
      }, 300);
    }
  }, [isLoading]);

  const onClick = () => {
    setActive(!active);

    if (!active) {
      setTimeout(() => {
        setConnected(true);
      }, 300);
    } else {
      setConnected(false);
    }
  };

  const onTransitionEnd = () => {
    setLoading(false);
  };

  return (
    <div className="history-log">
      <div className="history-timeline-wrap">
        <div
          className="history-timeline"
          onTransitionEnd={onTransitionEnd}
          style={{ height: started ? count * 124 : 0 }}
        ></div>
        <div className={"connector-revealer" + (active ? " revealing" : "")}></div>
      </div>

      <div className="version-list space-y-6">
        {props.records.map((record) => {
          return (
            <div key={record.id} className={"version-view" + (connected ? " connected" : "")}>
              <span className="version-label">{record.id}</span>
              {isLoading ? "Loading..." : record.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
