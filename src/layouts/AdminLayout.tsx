import type { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-teal-50/30">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;