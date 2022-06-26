import classNames from "classnames";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import BodhiTree from "./BodhiTree";

import { topCluster } from "../routes/index";
import { ICluster } from "../routes/types";
import styles from "./styles.module.scss";

function findBranchName(
  cluster: ICluster,
  pathKey: string
): string | undefined {
  for (const branch of cluster) {
    if (branch.info.path === pathKey) {
      return branch.info.name;
    } else if (branch.cluster) {
      const name: string | undefined = findBranchName(branch.cluster, pathKey);
      if (name) {
        return name;
      }
    }
  }
  return undefined;
}

export default function Home() {
  const [sidebarOn, setSidebarOn] = useState(true);
  const location = useLocation();
  const topBranch = findBranchName(
    topCluster,
    location.pathname.split("/")[1]
  );

  return (
    <div className="min-h-screen flex relative">
      <div
        className={classNames(styles.sidebarSlot, sidebarOn && styles.open)}
      />

      <div
        className={classNames(
          "fixed left-0",
          styles.sidebar,
          sidebarOn && styles.open
        )}
      >
        <button
          id="ctrl-btn"
          className={classNames(
            "absolute z-10 bg-slate-200 rounded-full flex-center group",
            styles.ctrlBtn
          )}
          onClick={() => {
            setSidebarOn((prev) => !prev);
            const ctrlBtn = document.getElementById("ctrl-btn")!;
            ctrlBtn.classList.remove(styles.hover);
            setTimeout(() => {
              ctrlBtn.classList.add(styles.hover);
            }, 800);
          }}
        >
          <span className={classNames("block relative ", styles.ctrlIcon)} />
        </button>
        <div className={styles.sidebarContent}>
          <BodhiTree />
        </div>
      </div>

      <div className="px-8 py-6 grow">
        {topBranch && (
          <h1 className="mb-6 text-4xl text-center text-purple-700 font-semibold">
            {topBranch}
          </h1>
        )}
        <Outlet />
      </div>
    </div>
  );
}
