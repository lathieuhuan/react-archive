import { Outlet, Route } from "react-router-dom";
import { IBranch } from "./types";

const DefaultComponent = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export const renderRoutes = (cluster: NonNullable<IBranch["cluster"]>) => {
  return cluster.map((branch) => {
    return (
      <Route
        key={branch.info.id}
        path={branch.info.path}
        element={branch.component ? <branch.component /> : branch.cluster ? <DefaultComponent /> : null}
      >
        {branch.cluster && renderRoutes(branch.cluster)}
      </Route>
    );
  });
};
