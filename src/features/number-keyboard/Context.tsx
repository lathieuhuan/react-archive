import { formatNumber } from "@Src/utils";
import { ReactNode, useState, createContext, useContext, useEffect } from "react";
import { NumberKeyboard } from "./NumberKeyboard";

type ActiveInput = {
  name: string;
  value: number;
  cursorIndex: number;
};

type NumberKeyboardContextValue = {
  visible: boolean;
  activeInput: ActiveInput;
  setVisible: (visible: boolean) => void;
  setActiveInput: (activeInput: ActiveInput) => void;
};

const DEFAULT_ACTIVE_INPUT = {
  name: "",
  value: 0,
  cursorIndex: -1,
};

export const NumberKeyboardContext = createContext<NumberKeyboardContextValue>({
  visible: false,
  activeInput: DEFAULT_ACTIVE_INPUT,
  setVisible: () => {},
  setActiveInput: () => {},
});

export interface ProviderProps {
  children: ReactNode;
}
export function Provider({ children }: ProviderProps) {
  const [visible, setVisible] = useState(false);
  const [activeInput, setActiveInput] = useState(DEFAULT_ACTIVE_INPUT);

  useEffect(() => {
    const openKeyboard = (e: MouseEvent) => {
      toggleKeyboard((e.target as HTMLElement).classList.contains("hdm-cursor-candidate"));
    };

    document.addEventListener("click", openKeyboard);

    return () => document.removeEventListener("click", openKeyboard);
  }, []);

  const toggleKeyboard = (visible: boolean) => {
    setVisible(visible);

    if (!visible) {
      setActiveInput((prev) => ({
        ...prev,
        cursorIndex: -1,
      }));
    }
  };

  const onClickKey = (key: string) => {
    const { name, value, cursorIndex } = activeInput;

    if (name && cursorIndex !== -1) {
      let valueStr = formatNumber(value);
      const oldLength = valueStr.length;

      valueStr =
        valueStr.slice(0, cursorIndex) + key + valueStr.slice(cursorIndex, valueStr.length);
      const newValue = +valueStr.replace(/,/g, "");

      setActiveInput((prev) => ({
        ...prev,
        value: newValue,
        cursorIndex: cursorIndex + (formatNumber(newValue).length - oldLength),
      }));
    }
  };

  const onClickBackspace = () => {
    const { name, value, cursorIndex } = activeInput;

    if (name && cursorIndex > 0) {
      let valueStr = formatNumber(value);
      const oldLength = valueStr.length;
      let index = cursorIndex;

      if (valueStr.slice(index - 1, index) === ",") {
        index--;
      }

      valueStr = valueStr.slice(0, index - 1) + valueStr.slice(index, valueStr.length);
      const newValue = +valueStr.replace(/,/g, "");

      setActiveInput((prev) => ({
        ...prev,
        value: newValue,
        cursorIndex: Math.max(index + (formatNumber(newValue).length - oldLength), 0),
      }));
    }
  };

  return (
    <NumberKeyboardContext.Provider
      value={{ visible, activeInput, setVisible: toggleKeyboard, setActiveInput }}
    >
      {children}
      <NumberKeyboard
        visible={visible}
        onClickKey={onClickKey}
        onClickBackspace={onClickBackspace}
        onClose={() => setVisible(false)}
      />
    </NumberKeyboardContext.Provider>
  );
}

export function useNumberKeyboard() {
  return useContext(NumberKeyboardContext);
}
