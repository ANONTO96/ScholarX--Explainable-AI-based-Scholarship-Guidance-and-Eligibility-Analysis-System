
import { useState } from "react";
import { Outlet } from "react-router";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5F1F7]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />

          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-h-screen lg:pl-64">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
