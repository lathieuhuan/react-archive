import { useEffect } from "react";
import clsx from "clsx";

import { formatNumber } from "@Src/utils";
import { useNumberKeyboard } from "./Context";
import styles from "./styles.module.scss";

export interface InputProps {
  className?: string;
  name?: string;
  value?: number;
  onChange?: (value: number) => void;
}
export function Input({ className, name = "undefined", value = 0, onChange }: InputProps) {
  const { activeInput, setActiveInput } = useNumberKeyboard();

  const isSelectedInput = activeInput.name === name;
  const characters = value ? formatNumber(value).split("") : ["0"];

  useEffect(() => {
    if (isSelectedInput && typeof onChange === "function") {
      onChange(activeInput.value);
    }
  }, [activeInput.value]);

  const onClickCharacter = (newCursorIndex: number) => {
    setActiveInput({
      name,
      value,
      cursorIndex: newCursorIndex,
    });
  };

  return (
    <div className={clsx("w-full flex", className)}>
      <span
        className={clsx(
          "hdm-cursor-candidate grow border-blue-500",
          isSelectedInput && activeInput.cursorIndex === 0 && styles["chosen-character"]
        )}
        onClick={() => onClickCharacter(0)}
      />

      {characters.map((character, i) => {
        return (
          <span
            key={i}
            className={clsx(
              "hdm-cursor-candidate border-blue-500 tracking-wide",
              isSelectedInput && i + 1 === activeInput.cursorIndex && styles["chosen-character"]
            )}
            onClick={() => onClickCharacter(i + 1)}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
}
