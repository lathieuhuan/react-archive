import { DownOutlined } from "@ant-design/icons";

interface ComboboxProps {
  keyword: string;
  options: Array<string>;
}

export default function Combobox(props: ComboboxProps) {
  return (
    <div>
      <div className="w-full h-full flex">
        <input className="grow"  />
        <button className="flex-center">
          <DownOutlined />
        </button>
      </div>
    </div>
  );
}
