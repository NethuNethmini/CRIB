import { ChevronRight, FileText, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../Components/Header/header";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-white flex flex-col">
      <Header />

      {/* Main content wrapper */}
      <main className="flex-1 mt-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-start mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-3xl font-bold text-slate-800 tracking-tight mb-3"
            >
              Welcome back,{" "}
              <span className="bg-linear-to-r from-main to-[#06b6d4] bg-clip-text text-transparent">
               JANE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-lg md:text-xl"
            >
              Your financial insights and credit health summary in one place.
            </motion.p>
          </div>

          {/* Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
          >
            {/* Left Section*/}
            <div className="relative bg-linear-to-r from-main to-[#06b6d4] flex flex-col justify-center items-center p-12 text-white">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                  <FileText className="w-20 h-20 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Your Credit Report Hub
                </h3>
                <p className="text-white/90 text-center max-w-sm">
                  Analyze your CRIB report and track your financial journey with
                  real-time updates and smart insights.
                </p>
              </motion.div>
            </div>

            {/* Right Section - Info */}
            <div className="p-10 md:p-10 flex flex-col justify-center space-y-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Monitor Your Credit Health
                </h2>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                  Stay on top of your financial profile. Access your CRIB report,
                  check for any discrepancies, and get insights on how to
                  improve your score. Consistent monitoring keeps your credit
                  secure and reliable.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid sm:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl"
                >
                  <Shield className="text-sky-500 w-6 h-6" />
                  <span className="text-slate-700 font-medium">
                    Secure & Private Access
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl"
                >
                  <TrendingUp className="text-cyan-500 w-6 h-6" />
                  <span className="text-slate-700 font-medium">
                    Real-Time Credit Insights
                  </span>
                </motion.div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-main text-white px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 w-fit group transition-all"
                 onClick={() => navigate("/report")}

              >
                View My Report
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
