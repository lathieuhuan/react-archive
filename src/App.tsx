import { CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./features";

import "antd/dist/reset.css";
import { topCluster } from "./routes";
import { renderRoutes } from "@Routes/renderRoutes";

notification.config({
  placement: "top",
  maxCount: 5,
  closeIcon: <CloseCircleOutlined className="text-xl hover:scale-125 hover:text-red-500 relative -right-2" />,
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {renderRoutes(topCluster)}
            <Route path="*" element={<Home.NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
