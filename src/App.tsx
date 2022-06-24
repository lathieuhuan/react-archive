import "antd/dist/antd.css";
import { useEffect } from "react";

import { CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import classNames from "classnames";

import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { routes } from "./routes";

const closeIconStyles =
  "text-xl hover:scale-125 hover:text-red-500 relative -top-2 -right-2";

function App() {
  useEffect(() => {
    notification.config({
      placement: "top",
      maxCount: 5,
      closeIcon: <CloseCircleOutlined className={closeIconStyles} />,
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

function Home() {
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0">
        <ul className="flex bg-slate-300">
          {routes.map((route, i) => {
            return (
              <li key={i}>
                <NavLink
                  to={route.path}
                  className={classNames(
                    "px-4 py-2 inline-block transition-all duration-150",
                    "hover:bg-slate-500 hover:text-white nav-link"
                  )}
                >
                  {route.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-12">
        <Outlet />
      </div>
    </div>
  );
}
