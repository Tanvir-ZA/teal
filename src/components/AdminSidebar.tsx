import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AdminSidebar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin-login";
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5 12 3l9 7.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 9.5V21h14V9.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21v-6h6v6"
          />
        </svg>
      ),
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 3h12v18H6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7h6M9 11h6M9 15h4"
          />
        </svg>
      ),
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 3h12v18H6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8h6M9 12h6M9 16h3"
          />
        </svg>
      ),
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19V5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19h16"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m7 15 3-4 3 2 4-6"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="shrink-0 border-b border-slate-200 px-6 py-6">
        <NavLink to="/admin" className="block">
          <h1 className="text-2xl font-bold tracking-tight text-teal-800">
            Teal
          </h1>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Admin Panel
          </p>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.icon}

              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          {/* Logout Icon */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors duration-200 group-hover:bg-red-100">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 17l5-5-5-5"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5V3h7v18h-7v-2"
              />
            </svg>
          </span>

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;