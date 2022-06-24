import ReactHookForm from "./react-hook-form";
import "antd/dist/antd.css";
import { notification } from "antd";
import { useEffect } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

const closeCn = "text-xl hover:scale-125 hover:text-red-500 relative -top-2 -right-2";

function App() {
  useEffect(() => {
    notification.config({
      placement: "top",
      maxCount: 5,
      closeIcon: (
        <CloseCircleOutlined className={closeCn} />
      ),
    });
  }, []);

  return (
    <div className="App">
      <ReactHookForm />
    </div>
  );
}

export default App;
