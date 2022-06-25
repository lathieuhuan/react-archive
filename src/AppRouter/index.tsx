import { BrowserRouter, Route, Routes } from "react-router-dom";
import { topCluster } from "./routes";
import { ICluster } from "./types";
import Home from "../Home";

function routeCluster(cluster: ICluster) {
  return cluster.map((branch) => {
    console.log(branch.component);
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
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {routeCluster(topCluster)}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
