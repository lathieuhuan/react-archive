import { Link, Outlet } from "react-router-dom";
import { BASE_URL } from "./constant";

export * from "./Basic";
export * from "./Intermediate";

export default function Axios() {
  return (
    <div>
      <p className="mb-2 block text-right text-sm italic">
        URL: <Link to={BASE_URL}>{BASE_URL}</Link>/posts
      </p>
      <Outlet />
    </div>
  );
}
