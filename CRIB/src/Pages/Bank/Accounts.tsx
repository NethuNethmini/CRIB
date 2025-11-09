import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAppSelector } from "../../Store/hooks";

interface Account {
  nic: string;
  cribId: string;
  fullName: string;
  dateOfBirth: string;
  isActive: boolean;
  phoneNumber: string;
  email: string;
  nicFrontCid: string;
  nicBackCid: string;
  createdBy: string;
  createdAt: string;
  creator: string;
}

export default function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl: string = import.meta.env.VITE_API_URL;

  // Redux values
  const bankId = useAppSelector((state) => state.auth.bankId);
  const bankName = useAppSelector((state) => state.auth.bankName);
  const token = useAppSelector((state) => state.auth.auth);

  const getAccounts = async () => {
    try {
      const res = await fetch(
        `${apiUrl}bank/get/all/cribs?bankId=${encodeURIComponent(
          bankId
        )}&bankName=${encodeURIComponent(bankName)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch accounts:", res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Fetched accounts:", data);

      if (Array.isArray(data.cribAccount)) {
        setAccounts(data.cribAccount);
      } else {
        console.error("Unexpected API format:", data);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Accounts Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all customer accounts</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex bg-gray-50 border-b border-gray-100 font-semibold text-gray-600 uppercase text-xs">
                <div className="w-1/12 px-6 py-4">#</div>
                <div className="w-3/12 px-6 py-4">Account Holder</div>
                <div className="w-3/12 px-6 py-4">Email</div>
                <div className="w-2/12 px-6 py-4">Phone</div>
                <div className="w-2/12 px-6 py-4">Status</div>
                {/* <div className="w-1/12 px-6 py-4">Actions</div> */}
              </div>

              {/* Rows */}
              {filteredAccounts.map((account, index) => (
                <div
                  key={account.cribId}
                  className={`flex border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="w-1/12 px-6 py-4">{index + 1}</div>
                  <div className="w-3/12 px-6 py-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-main to-[#06b6d4] flex items-center justify-center text-white font-semibold mr-3">
                      {account.fullName.charAt(0)}
                    </div>
                    <span>{account.fullName}</span>
                  </div>
                  <div className="w-3/12 px-6 py-4">{account.email}</div>
                  <div className="w-2/12 px-6 py-4">{account.phoneNumber}</div>
                  <div className="w-2/12 px-6 py-4">
                    {account.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </div>
                  {/* <div className="w-1/12 px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div> */}
                </div>
              ))}

              {filteredAccounts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No accounts found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
