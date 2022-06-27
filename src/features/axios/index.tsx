import { Link, Outlet } from "react-router-dom";
import { BASE_URL } from "./constant";

export default function Axios() {
  return (
    <div>
      <p className="mb-2 block text-right text-sm italic">
        Base URL: <Link to={BASE_URL}>{BASE_URL}</Link>
      </p>
      <Outlet />
    </div>
  );
}
