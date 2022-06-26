import { CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./features";

import { ICluster } from "./routes/types";
import { topCluster } from "./routes";
import "antd/dist/antd.css";

function routeCluster(cluster: ICluster) {
  return cluster.map((branch) => {
    return (
      <Route
        key={branch.info.id}
        path={branch.info.path}
        element={branch.component ? <branch.component /> : null}
      >
        {branch.cluster && routeCluster(branch.cluster)}
      </Route>
    );
  });
}

notification.config({
  placement: "top",
  maxCount: 5,
  closeIcon: (
    <CloseCircleOutlined className="text-xl hover:scale-125 hover:text-red-500 relative -right-2" />
  ),
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {routeCluster(topCluster)}
            <Route path="*" element={<Home.NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
