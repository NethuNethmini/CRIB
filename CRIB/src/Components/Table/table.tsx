import { useEffect } from "react";
import { Plus, Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CreditFacilitiesTable() {
  const navigate = useNavigate();

  const facilities = [
    {
      facilityType: "Personal Loan",
      accountNumber: "ACCT-PL-001234",
      limit: "LKR 500,000.00",
      outstandingBalance: "LKR 125,500.00",
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      facilityType: "Home Loan",
      accountNumber: "ACCT-HL-005432",
      limit: "LKR 15,000,000.00",
      outstandingBalance: "LKR 14,120,000.00",
      status: "Pending Approval",
      statusColor: "bg-amber-100 text-amber-700",
    },
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      once: true,    // animate only once
    });
  }, []);

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
      data-aos="fade-in"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center mb-6"
        data-aos="fade-in"
      >
        <h2 className="text-2xl font-semibold text-main">
          Linked Credit Facilities
        </h2>
        <button
          onClick={() => navigate("/main/facilities")}
          className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-200 shadow-sm"
        >
          <Plus size={18} />
          Add New Facility
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-gray-100 rounded-xl" data-aos="fade-in">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
          <div>Facility Type</div>
          <div>Account Number</div>
          <div>Limit</div>
          <div>Outstanding</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 py-4 px-4 items-center hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 transition-all duration-200"
              data-aos="fade-in"
              data-aos-delay={index * 100} 
            >
              <div className="text-gray-900 font-medium">
                {facility.facilityType}
              </div>
              <div className="text-gray-600">{facility.accountNumber}</div>
              <div className="text-gray-900 font-semibold">{facility.limit}</div>
              <div className="text-gray-900 font-semibold">{facility.outstandingBalance}</div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${facility.statusColor}`}
                >
                  {facility.status}
                </span>
              </div>
              <div className="flex justify-end gap-3">
                <button className="flex items-center gap-1 text-sky-600 hover:text-sky-800 font-medium transition">
                  <Edit3 size={16} /> Update
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 font-medium transition">
                  <Eye size={16} /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-5 text-sm text-gray-500 flex justify-between items-center"
        data-aos="fade-in"
        data-aos-delay={facilities.length * 100}
      >
        <span>
          Showing <strong>{facilities.length}</strong> facilities
        </span>
      </div>
    </div>
  );
}
