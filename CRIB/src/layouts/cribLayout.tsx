import { Outlet } from "react-router-dom";
// import Header from "../Components/Header/header";
import Sidebar from "../Components/Sidebar/Sidebars";

const CribLayout = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Sidebar with glassmorphism effect */}
      <aside className="w-64 hidden md:block relative">
        <div className="fixed w-64 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl shadow-slate-900/5">
          <Sidebar />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with blur effect */}
        {/* <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <Header />
        </header> */}

        {/* Page content with subtle animation */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Modern Footer */}
        <footer className="mt-auto p-6 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">
                © 2025 CRIB System
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default CribLayout;