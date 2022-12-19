import { MouseEventHandler, useRef } from "react";
import { INumberKeyboardProps } from "./types";

export function NumberKeyboard({
  wrapperClassName,
  keyboardHeight = 244,
  suggestions,
  locale = "en",
  doneText = "Done",
  withTripleZeroes,
  withDecimalSeparator,
  isDisabledDone,
  onClickKey,
  onClickSuggestion,
  onClickBackspace,
  onHoldBackspace,
  onClickDone,
}: INumberKeyboardProps) {
  const isHoldingRef = useRef(false);
  const intl = new Intl.NumberFormat(locale);

  const onTouchStartBackspace = () => {
    if (onHoldBackspace) {
      isHoldingRef.current = true;

      setTimeout(() => {
        if (isHoldingRef.current) {
          onHoldBackspace();
        }
      }, 500);
    }
  };

  const onTouchEndBackspace = () => {
    if (onHoldBackspace) {
      isHoldingRef.current = false;
    }
  };

  const preventContextMenu: MouseEventHandler = (e) => {
    e.preventDefault();
  };

  const renderKeyButton = (key: string, className = "") => {
    return (
      <button
        key={key}
        type="button"
        className={"bg-white text-2xl active:bg-blue-100 select-none outline-none " + className}
        onContextMenu={preventContextMenu}
        onClick={() => onClickKey && onClickKey(key)}
      >
        {key}
      </button>
    );
  };

  return (
    <div className={wrapperClassName}>
      {suggestions?.length ? (
        <div className="bg-ink-100 flex overflow-auto">
          {suggestions.map((suggestion, i) => {
            return (
              <button
                key={i}
                className="px-4 py-3 text-base font-medium grow shrink-0 select-none outline-none"
                onContextMenu={preventContextMenu}
                onClick={() => onClickSuggestion && onClickSuggestion(suggestion, i)}
              >
                {intl.format(suggestion)}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        className="bg-blue-200 grid grid-cols-4 grid-rows-4 gap-px border border-transparent"
        style={{ height: keyboardHeight }}
      >
        <div className="row-span-4 grid col-span-3 gap-px">
          <div className="row-span-3 grid grid-cols-3 gap-px">
            {[...Array(9)].map((_, i) => {
              return renderKeyButton((i + 1).toString());
            })}
          </div>
          <div className="grid grid-cols-3 gap-px">
            {renderKeyButton(
              "0",
              withTripleZeroes ? "col-span-1" : !withTripleZeroes && withDecimalSeparator ? "col-span-2" : "col-span-3"
            )}
            {withTripleZeroes && renderKeyButton("000", withDecimalSeparator ? "col-span-1" : "col-span-2")}
            {withDecimalSeparator && renderKeyButton(locale === "en" ? "." : ",", "col-span-1")}
          </div>
        </div>

        <div className="row-span-4 grid grid-rows-2 gap-px">
          <button
            type="button"
            className="bg-white active:bg-blue-100 select-none outline-none"
            onTouchStart={onTouchStartBackspace}
            onTouchEnd={onTouchEndBackspace}
            onContextMenu={preventContextMenu}
            onClick={onClickBackspace}
          >
            X
          </button>
          <button
            type="button"
            className={
              "text-xl font-medium select-none outline-none " +
              (isDisabledDone ? "text-ink-300 bg-ink-100" : "text-white bg-blue-500 active:bg-blue-400")
            }
            disabled={isDisabledDone}
            onContextMenu={preventContextMenu}
            onClick={onClickDone}
          >
            {doneText}
          </button>
        </div>
      </div>
    </div>
  );
}
