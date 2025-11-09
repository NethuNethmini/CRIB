import { Outlet } from "react-router-dom";
import Header from "../Components/Header/header";
import Sidebar from "../Components/Sidebar/Sidebars";

const CribLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <Header />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Optional Footer */}
        {/* <footer className="p-4 text-center text-sm text-gray-500 border-t bg-white">
          © 2025 CRIB System
        </footer> */}
      </div>
    </div>
  );
};

export default CribLayout;
