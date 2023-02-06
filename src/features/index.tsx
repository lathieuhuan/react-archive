import classNames from "classnames";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { topCluster } from "@Src/routes";
import BodhiTree from "@Components/BodhiTree";
import styles from "./styles.module.scss";

const Home = () => {
  const [sidebarOn, setSidebarOn] = useState(true);
  const topPath = useLocation().pathname.split("/")[1];
  let topBranch = "";

  for (const branch of topCluster) {
    if (branch.info.path === topPath) {
      topBranch = branch.info.name;
    }
  }

  return (
    <div className="min-h-screen flex relative">
      <div className={classNames(styles.sidebarSlot, sidebarOn && styles.open)} />

      <div className={classNames("fixed left-0", styles.sidebar, sidebarOn && styles.open)}>
        <button
          id="ctrl-btn"
          className={classNames("absolute z-10 bg-slate-200 rounded-full flex-center group", styles.ctrlBtn)}
          onClick={() => {
            const ctrlBtn = document.getElementById("ctrl-btn")!;

            setSidebarOn((prev) => !prev);
            ctrlBtn.classList.remove(styles.hover);

            setTimeout(() => {
              ctrlBtn.classList.add(styles.hover);
            }, 500);
          }}
        >
          <span className={classNames("block relative ", styles.ctrlIcon)} />
        </button>
        <div className={styles.sidebarContent}>
          <BodhiTree />
        </div>
      </div>

      <div className="px-8 py-6 grow overflow-x-hidden">
        {topBranch && <h1 className="mb-6 text-4xl text-center text-purple-700 font-semibold">{topBranch}</h1>}
        <Outlet />
      </div>
    </div>
  );
};

Home.NotFound = () => {
  return (
    <div className="w-full h-full flex-center flex-col">
      <h1 className="text-9xl text-red-600">404</h1>
      <h2 className="text-6xl text-red-600">Page not found</h2>
    </div>
  );
};

export { Home };
