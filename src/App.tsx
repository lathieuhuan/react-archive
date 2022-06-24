import "antd/dist/antd.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import Home from "./Home";
import { routes } from "./routes";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {routes.map((route, i) => {
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={<route.component />}
                />
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
