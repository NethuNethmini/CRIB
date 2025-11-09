import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChartNoAxesCombined } from "lucide-react";
import { SidebarItem } from "./sidebarItems";
import { navItems } from "./navItems";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../Store/Slices/AuthSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleItemClick = (path: string, label: string) => {
    if (label === "Log Out") {
      // Clear auth state
      dispatch(clearAuth());
      // Navigate to landing page
      navigate("/", { replace: true });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="w-64 h-screen bg-white flex flex-col justify-between p-5">
      <div>
        {/* Logo / Brand */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200/50 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all duration-300">
              <ChartNoAxesCombined size={24} />
            </div>
            <div className="absolute -inset-1 bg-linear-to-r from-main to-[#06b6d4] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="font-bold text-2xl bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] bg-clip-text text-transparent tracking-tight">
              CRIB
            </h2>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              Network Platform
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => handleItemClick(item.path!, item.label)}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-gray-100">
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Log Out"
          active={false}
          onClick={() => handleItemClick("", "Log Out")}
        />
      </div>
    </div>
  );
}
