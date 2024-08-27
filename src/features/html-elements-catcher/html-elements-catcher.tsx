import { useEffect, useRef } from "react";
import { HTMLElementsCatcher } from "@Src/packages";

export function HTMLElementsCatcherDemo() {
  const catcher = useRef(new HTMLElementsCatcher());

  useEffect(() => {
    return () => {
      catcher.current.endSession();
    };
  }, []);

  const onClickStart = () => {
    catcher.current.startSession();
  };

  return (
    <div>
      <button className="button button-primary" onClick={onClickStart}>
        Start
      </button>
    </div>
  );
}
