import { NumberKeyboard as NumberKeyboardCpn, NumberKeyboardProps } from "./NumberKeyboard";
import { Provider, ProviderProps } from "./Context";
import { Input, InputProps } from "./Input";

interface NumberKeyboardGroup {
  (props: NumberKeyboardProps): JSX.Element;
  Provider: (props: ProviderProps) => JSX.Element;
  Input: (props: InputProps) => JSX.Element;
}

const NumberKeyboard = NumberKeyboardCpn as NumberKeyboardGroup;

NumberKeyboard.Provider = Provider;
NumberKeyboard.Input = Input;

export { NumberKeyboard };
