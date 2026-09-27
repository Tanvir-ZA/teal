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
      icon: "⌂",
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: "▣",
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: "◫",
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: "◒",
    },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-teal-100 bg-white">
      {/* Brand */}
      <div className="border-b border-teal-100 px-6 py-6">
        <NavLink to="/admin" className="block">
          <h1 className="text-2xl font-bold tracking-tight text-teal-800">
            Teal
          </h1>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-500">
            Admin Panel
          </p>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-800"
              }`
            }
          >
            <span className="flex h-6 w-6 items-center justify-center text-base">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-teal-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-6 w-6 items-center justify-center">
            ↪
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;