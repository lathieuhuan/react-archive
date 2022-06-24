import { useState } from "react";
import TabBar from "../components/TabBar";
import BasicForm from "./basic";
import IntermediateForm from "./intermediate";

export default function ReactHookForm() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const forms = [
    <BasicForm />,
    <IntermediateForm />
  ];
  return (
    <div>
      <h1 className="py-4 text-4xl text-center text-purple-700 font-semibold">
        React Hook Form
      </h1>
      <div>
        <TabBar
          tabs={["Basic", "Intermediate"]}
          selectedIndex={currentTabIndex}
          onSelect={setCurrentTabIndex}
        />
      </div>
      {forms[currentTabIndex]}
    </div>
  );
}
