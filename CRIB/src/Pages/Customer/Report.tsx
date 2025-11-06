import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Mail,
  Download,
} from "lucide-react";
import Header from "../../Components/Header/header";

export default function Report() {
  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [creditSummaryOpen, setCreditSummaryOpen] = useState(false);
  const [detailedHistoryOpen, setDetailedHistoryOpen] = useState(false);

  return (
    <div className="h-screen overflow-y-auto">
        <Header/>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 h-screen overflow-y-auto">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-700 hover:text-main transition-all hover:gap-3">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3 bg-[#06b6d4] rounded-md">
            <button className="p-2 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {/* Hero Section */}
        <div className="mt-4">
          <div className="bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold mb-2">Your CRIB Report</h1>
              <p className="text-indigo-100 mb-6">
                Complete credit information at your fingertips
              </p>
              <button className="flex items-center gap-2 bg-white text-main px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition-all hover:shadow-md">
                <Mail className="w-4 h-4" />
                Email Report Copy
              </button>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-4">
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <button
              onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-main">
                  Personal Information
                </h3>
              </div>
              {personalInfoOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              )}
            </button>

            {personalInfoOpen && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      Alice
                    </p>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      National ID
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      199012345V
                    </p>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      January 23, 1990
                    </p>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Addresses
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      123 Main Street, Colombo 05, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Credit Summary Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <button
              onClick={() => setCreditSummaryOpen(!creditSummaryOpen)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-main">
                  Credit Summary
                </h3>
              </div>
              {creditSummaryOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-main transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-main transition-colors" />
              )}
            </button>

            {creditSummaryOpen && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  <div className=" rounded-lg p-6 border border-blue-100">
                    <p className="text-gray-600">
                      Credit summary details will appear here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Credit History Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <button
              onClick={() => setDetailedHistoryOpen(!detailedHistoryOpen)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-main">
                  Detailed Credit History and Facilities
                </h3>
              </div>
              {detailedHistoryOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-main transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-main transition-colors" />
              )}
            </button>

            {detailedHistoryOpen && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  <div className="rounded-lg p-6 border border-blue-100">
                    <p className="text-gray-600">
                      Detailed credit history will appear here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This report was generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}
