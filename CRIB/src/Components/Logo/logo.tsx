import { ChartNoAxesCombined } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center justify-center gap-4 group cursor-pointer">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-main to-[#06b6d4] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all duration-300">
          <ChartNoAxesCombined size={24} />
        </div>
        <div className="absolute -inset-1 bg-linear-to-r from-main to-[#06b6d4] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="font-bold text-2xl bg-linear-to-r from-main to-[#06b6d4] bg-clip-text text-transparent tracking-tight leading-none mb-1">
          CRIB
        </h2>
        <p className="text-xs text-gray-500 font-medium leading-none">
          Network Platform
        </p>
      </div>
    </div>
  );
}

export default Logo;