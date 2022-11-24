import { useState } from "react";

type Log = {
  text: string;
  className?: string;
};

interface IUseLoggerArgs {
  title?: string;
}
export const useLogger = (args?: IUseLoggerArgs) => {
  const [logs, setLogs] = useState<Log[]>([]);

  return {
    logs,
    log(content: string | string[], className?: string) {
      setLogs((prevLogs) => {
        return prevLogs.concat({
          text: Array.isArray(content) ? content.join(" ") : content,
          className,
        });
      });
    },
    reset() {
      setLogs([]);
    },
    renderLogger(className?: string) {
      return (
        <div className={"border border-slate-300 rounded " + (className || "")}>
          <div className="px-4 py-2 bg-slate-200" hidden={!args?.title}>
            <h3 className="text-2xl font-semibold">{args?.title}</h3>
          </div>
          <div className="px-4 py-2 relative">
            <ul className="pl-4 list-disc leading-8">
              {logs.map(({ text, className }, i) => {
                return (
                  <li key={i} className={className}>
                    {text}
                  </li>
                );
              })}
            </ul>
            <button className="button button-primary absolute top-1 right-1" hidden={!logs.length} onClick={() => setLogs([])}>
              Reset
            </button>
          </div>
        </div>
      );
    },
  };
};
