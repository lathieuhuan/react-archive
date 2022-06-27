import { Outlet } from "react-router-dom";
import { BASE_URL } from "./constant";

export default function Axios() {
  return (
    <div>
      <p className="text-right text-sm italic">Base URL: {BASE_URL}</p>
      <Outlet />
    </div>
  );
}
