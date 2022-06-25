import BodhiTree from "./BodhiTree";

export default function Home() {
  
  return (
    <div className="min-h-screen flex">
      <div className="w-80 px-2 py-8 bg-slate-400">
        <BodhiTree />
      </div>
      <div className="grow bg-slate-700"></div>
      {/* <nav className="fixed top-0 left-0 right-0">
        <ul className="flex bg-slate-300">
          {routes.map((route, i) => {
            return (
              <li key={i}>
                <NavLink
                  to={route.path}
                  className={classNames(
                    "px-4 py-2 inline-block transition-all duration-150",
                    "hover:bg-slate-500 hover:text-white nav-link"
                  )}
                >
                  {route.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="pt-12">
        <Outlet />
      </div> */}
    </div>
  );
}
