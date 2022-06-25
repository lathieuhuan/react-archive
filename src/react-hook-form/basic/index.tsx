import { Outlet } from "react-router-dom";

export default function BasicForms() {
  return (
    <div className="px-8 py-4 flex gap-8">
      <Outlet />
    </div>
  );
}
