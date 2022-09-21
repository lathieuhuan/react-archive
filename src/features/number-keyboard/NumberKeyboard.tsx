import { Popup } from "antd-mobile";
import { clsx } from "clsx";

export interface NumberKeyboardProps {
  visible?: boolean;
  onClickKey?: (key: string) => void;
  onClickBackspace?: () => void;
  onClose?: () => void;
}
export const NumberKeyboard = ({
  visible,
  onClickKey,
  onClickBackspace,
  onClose,
}: NumberKeyboardProps) => {
  return (
    <Popup visible={visible} destroyOnClose mask={false}>
      <div className="grid grid-cols-4">
        <div className="col-span-3 grid grid-cols-3">
          {[...Array(9)].concat(["0", "000"]).map((text, i) => {
            const content: string = i < 9 ? i + 1 : text;

            return (
              <button
                key={content}
                className={clsx(
                  "py-4 border-r border-t border-blue-200 text-xl font-medium",
                  i === 10 && "col-span-2"
                )}
                onClick={() => onClickKey && onClickKey(content)}
              >
                {content}
              </button>
            );
          })}
        </div>
        <div className="grid grid-rows-2">
          <button className="text-2xl border-t border-blue-200" onClick={onClickBackspace}>
            X
          </button>
          <button className="text-base bg-blue-500 text-white font-medium" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </Popup>
  );
};
