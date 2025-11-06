import { LogIn, Shield, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-6 hover:rotate-0 transition-transform duration-500">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Join with CRIB
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Connect securely with CRIB to access credit information and manage your customers efficiently.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all">
              <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-medium">Secure</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:bg-cyan-50 hover:border-cyan-200 transition-all">
              <Zap className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-medium">Fast</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all">
              <Lock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-medium">Encrypted</p>
            </div>
          </div>

          {/* Join Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
          onClick={() => navigate("/main/customers")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogIn className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <span className="relative z-10" >Join with CRIB</span>
          </button>

         </div>

      
      </div>
    </div>
  );
}