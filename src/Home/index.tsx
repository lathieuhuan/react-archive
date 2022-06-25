import { Outlet } from "react-router-dom";
import BodhiTree from "./BodhiTree";

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <div className="w-80">
        <BodhiTree />
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}
