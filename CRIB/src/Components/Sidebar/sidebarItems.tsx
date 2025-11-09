interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
        active ? "bg-main/10 text-main font-medium shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className={`transition-colors duration-200 ${active ? "text-main" : "text-gray-500 group-hover:text-gray-700 cursor-pointer"}`}>
        {icon}
      </span>
      <span className="text-sm tracking-wide cursor-pointer">{label}</span>
    </button>
  );
}
