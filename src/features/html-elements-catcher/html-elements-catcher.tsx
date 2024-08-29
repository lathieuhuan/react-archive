import { useEffect, useRef } from "react";
import { HTMLElementsCatcher } from "@Src/packages";

export function HTMLElementsCatcherDemo() {
  const catcher = useRef<HTMLElementsCatcher>();

  useEffect(() => {
    catcher.current = new HTMLElementsCatcher();

    return () => {
      logListenersCount();
      catcher.current?.endSession();
    };
  }, []);

  const onClickStart = () => {
    catcher.current?.startSession();
  };

  const logListenersCount = () => {
    console.log(catcher.current?.listenersCount);
  };

  return (
    <div>
      <div className="flex gap-4">
        <button className="button button-primary" onClick={onClickStart}>
          Start
        </button>
        <button className="button button-danger" onClick={logListenersCount}>
          Log Listeners count
        </button>
      </div>
    </div>
  );
}
