import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Optional: Public Header */}
      {/* <header className="p-4 shadow bg-white">Public Header</header> */}

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Optional: Public Footer */}
      {/* <footer className="p-4 text-center text-sm text-gray-500 bg-white border-t">
        © 2025 CRIB System
      </footer> */}
    </div>
  );
};

export default PublicLayout;
