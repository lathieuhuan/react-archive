import { Outlet } from "react-router-dom";
import BodhiTree from "./BodhiTree";

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <div className="w-80 px-2 py-8 bg-slate-400">
        <BodhiTree />
      </div>
      <div className="grow bg-slate-700">
        <Outlet />
      </div>
    </div>
  );
}
