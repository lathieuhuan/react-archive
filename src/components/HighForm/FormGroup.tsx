import { DownOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { useFormStore } from "./form-store";

interface IFormGroupProps {
  groupKey: string;
  header: string;
  children: React.ReactNode;
  collapsible?: boolean;
  extra?: React.ReactNode;
  cols?: number;
  expandIcon?: null | (() => React.ReactNode);
}

export const FormGroup = ({
  groupKey,
  expandIcon,
  collapsible = true,
  cols = 1,
  children,
  ...panelProps
}: IFormGroupProps) => {
  const [activeGroupKeys, setStore] = useFormStore((store) => store.activeGroupKeys);
  const [accordionMode] = useFormStore((store) => store.accordionMode);

  const onClickPanel = () => {
    if (!collapsible) {
      return;
    }

    if (accordionMode) {
      setStore({
        activeGroupKeys: activeGroupKeys.includes(groupKey) ? [] : [groupKey],
      });
    } else {
      setStore({
        activeGroupKeys: activeGroupKeys.includes(groupKey)
          ? activeGroupKeys.filter((activeGroupKey) => activeGroupKey !== groupKey)
          : activeGroupKeys.concat(groupKey),
      });
    }
  };

  return (
    <Collapse
      activeKey={!collapsible || activeGroupKeys.includes(groupKey) ? "1" : "0"}
      expandIcon={({ isActive }) => {
        if (typeof expandIcon === "function") {
          return expandIcon();
        }
        return <DownOutlined rotate={isActive ? 180 : 0} style={{ fontSize: 14, color: "#1677FF" }} />;
      }}
      expandIconPosition="end"
      ghost
      className="rounded-md overflow-hidden voucher-form-group"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
      onChange={onClickPanel}
    >
      <Collapse.Panel
        key="1"
        className="bg-white "
        forceRender
        showArrow={collapsible && expandIcon !== null}
        {...panelProps}
      >
        <div
          className="py-1 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {children}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};
