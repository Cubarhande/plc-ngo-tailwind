import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 dark:bg-slate-950">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="min-w-0 md:ml-64">

        {/* ===================================================
            FIXED TOPBAR
        ==================================================== */}

        <div className="fixed left-0 right-0 top-0 z-40 md:left-64">
          <Topbar
            onMenuClick={openSidebar}
            title="PLC Admin"
          />
        </div>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <main
          className="
            min-w-0
            py-18
            p-3
            sm:p-4
            md:p-6
            sm:py-18
            md:py-18
          "
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;