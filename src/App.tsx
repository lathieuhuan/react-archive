import { CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import "antd/dist/antd.css";
import { useEffect } from "react";

import AppRouter from "./AppRouter";

function App() {
  useEffect(() => {
    notification.config({
      placement: "top",
      maxCount: 5,
      closeIcon: (
        <CloseCircleOutlined className="text-xl hover:scale-125 hover:text-red-500 relative -right-2" />
      ),
    });
  }, []);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
