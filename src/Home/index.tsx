import classNames from "classnames";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BodhiTree from "./BodhiTree";
import styles from "./styles.module.scss";

export default function Home() {
  const [sidebarOn, setSidebarOn] = useState(true);
  return (
    <div className="min-h-screen flex relative">
      <div
        className={classNames(styles.sidebarSlot, sidebarOn && styles.open)}
      />

      <div
        className={classNames(
          "absolute left-0",
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

      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}
