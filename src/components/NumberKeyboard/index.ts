import { NumberKeyboard as NumberKeyboardCpn } from "./NumberKeyboard";
import { Provider, IProviderProps } from "./Provider";
import { Input, InputProps } from "./Input";
import { INumberKeyboardProps } from "./types";

interface NumberKeyboardGroup {
  (props: INumberKeyboardProps): JSX.Element;
  Provider: (props: IProviderProps) => JSX.Element;
  Input: (props: InputProps) => JSX.Element;
}

const NumberKeyboard = NumberKeyboardCpn as NumberKeyboardGroup;

NumberKeyboard.Provider = Provider;
NumberKeyboard.Input = Input;

export { NumberKeyboard };
