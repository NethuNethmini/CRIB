import { ChevronDown} from "lucide-react";


function Header() {
  
  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 rounded-br-3xl rounded-bl-3xl px-6 mx-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 bg-blue-600 rounded"></div> */}
            {/* <span className="text-xl font-semibold text-gray-900">
              Bank Corp
            </span> */}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings className="w-5 h-5 text-gray-600" />
            </button> */}

            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 bg-main/20 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  Jane Doe
                </div>
                {/* <div className="text-xs text-gray-500">Employee</div> */}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
