import classNames from "classnames";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import BodhiTree from "./BodhiTree";
import styles from "./styles.module.scss";

const CTRL_BTN_STYLES = classNames(
  "absolute z-10 bg-slate-200 rounded-full",
  "flex justify-center items-center",
  styles.ctrlBtn
);

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
          sidebarOn && "shadow shadow-slate-700 " + styles.open
        )}
      >
        <button
          className={CTRL_BTN_STYLES}
          onClick={() => setSidebarOn((prev) => !prev)}
        >
          <span className={classNames("block relative", styles.ctrlIcon)} />
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
