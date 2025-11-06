import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  LogOut,
  ChartNoAxesCombined,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  active?: boolean;
  onClick: () => void;
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-main/10 text-main font-medium shadow-sm"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span
        className={`transition-colors duration-200 ${
          active ? "text-main" : "text-gray-500 group-hover:text-gray-700 cursor-pointer"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm tracking-wide cursor-pointer">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    // {
    //   label: "Dashboard",
    //   icon: <LayoutGrid size={18} />,
    //   path: "/main/dashboard",
    // },
    { label: "Customers", icon: <Users size={18} />, path: "/main/customers" },
    // { label: "Reports", icon: <BarChart3 size={18} />, path: "/main/reports" },
    // {
    //   label: "Analytics",
    //   icon: <PieChart size={18} />,
    //   path: "/main/analytics",
    // },
    // { label: "Settings", icon: <Settings size={18} />, path: "/main/settings" },
  ];

  const handleItemClick = (path: string, label: string) => {
    if (label === "Log Out") {
      alert("Logging out...");
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
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] flex items-center justify-center text-white shadow-xl  group-hover:scale-105 transition-all duration-300">
              <ChartNoAxesCombined
                size={24}
              />
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
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => handleItemClick(item.path, item.label)}
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
