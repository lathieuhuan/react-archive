import { DownOutlined } from "@ant-design/icons";
import { Collapse } from "@Components/temporary";
import { useFormStore } from "./form-store";

interface IFormGroupProps {
  groupKey: string;
  headerText: string;
  children: React.ReactNode;
}

export const FormGroup = ({ groupKey, headerText, children }: IFormGroupProps) => {
  const [activeGroupKeys, setStore] = useFormStore((store) => store.activeGroupKeys);
  const [accordionGroups] = useFormStore((store) => store.accordionGroups);

  const onClickPanel = () => {
    if (accordionGroups) {
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
      activeKey={activeGroupKeys.includes(groupKey) ? "1" : "0"}
      collapsible="header"
      expandIcon={({ isActive }) => {
        return <DownOutlined rotate={isActive ? 180 : 0} style={{ fontSize: 14, color: "#1677FF" }} />;
      }}
      expandIconPosition="end"
      ghost
      className="rounded-md overflow-hidden"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <Collapse.Panel
        className="bg-white"
        header={
          <p className="w-full font-semibold" style={{ padding: "13px 6px 13px 12px" }} onClick={onClickPanel}>
            {headerText}
          </p>
        }
        key="1"
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
