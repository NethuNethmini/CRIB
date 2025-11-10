import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-main/90 transition-all gap-2"
      >
       Login to 
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleSelect("/bank-login")}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Bank
          </button>
          <button
            onClick={() => handleSelect("/crib-login")}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            CRIB Member
          </button>
        </div>
      )}
    </div>
  );
}
