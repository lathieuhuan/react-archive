import { useEffect, useRef } from "react";
import { HTMLElementsCatcher } from "@Src/packages";

export function HTMLElementsCatcherDemo() {
  const catcher = useRef<HTMLElementsCatcher>();

  useEffect(() => {
    catcher.current = new HTMLElementsCatcher();

    return () => {
      catcher.current?.endSession();
    };
  }, []);

  const onClickStart = () => {
    catcher.current?.startSession();
  };

  return (
    <div>
      <button className="button button-primary" onClick={onClickStart}>
        Start
      </button>
    </div>
  );
}
