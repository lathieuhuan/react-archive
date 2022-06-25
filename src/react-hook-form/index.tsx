import { Outlet } from "react-router-dom";

export default function ReactHookForm() {
  return (
    <div className="w-full">
      <h1 className="py-4 text-4xl text-center text-purple-700 font-semibold">
        React Hook Form
      </h1>
      <Outlet />
    </div>
  );
}
