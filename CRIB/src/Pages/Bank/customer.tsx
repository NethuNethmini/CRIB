import { useState } from "react";
import { Search, ArrowRight, UserPlus, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store/hooks";

export default function CRIBProfileSearch() {
  const navigate = useNavigate();
  const [identifierType, setIdentifierType] = useState("NIC");
  const [identifierNumber, setIdentifierNumber] = useState("");
  const [searchResult, setSearchResult] = useState<"found" | "not-found" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authData = useAppSelector((state) => state.auth);

  const apiUrl: string = import.meta.env.VITE_API_URL;

  // Fetch customer by ID
  const getCusById = async (nic: string, bankName: string): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log(error)

    try {
      const queryParams = new URLSearchParams({
        nic: nic.toString(),
        bankName: bankName.toString(),
      });

      const res = await fetch(`${apiUrl}bank/get/crib?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.auth}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch customer: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("CRIB Search Result:", data);

      if (data && data.exists) {
        setSearchResult("found");
      } else {
        setSearchResult("not-found");
      }
    } catch (error: any) {
      console.error("Error fetching CRIB profile:", error);
      setError(error.message || "Error fetching CRIB profile");
    } finally {
      setLoading(false);
    }
  };


  // Handle search button click
  const handleSearch = () => {
    if (!identifierNumber.trim()) {
      setError("Please enter an identifier number");
      return;
    }
    getCusById(identifierNumber, authData.bankName);
  };

  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-main mb-3">
              Find or Create a CRIB Profile
            </h1>
            <p className="text-gray-600">
              Search for an existing customer profile using their NIC or
              Passport number.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Identifier Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identifier Type
              </label>
              <div className="relative">
                <select
                  value={identifierType}
                  onChange={(e) => setIdentifierType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-gray-300 text-gray-900"
                >
                  <option value="NIC">NIC</option>
                  <option value="Passport">Passport</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Identifier Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identifier Number
              </label>
              <input
                type="text"
                placeholder="Enter number..."
                value={identifierNumber}
                onChange={(e) => setIdentifierNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-3/4 bg-gradient-to-r from-main via-[#0284c7] to-[#06b6d4] text-white font-semibold py-3.5 rounded-xl hover:shadow-sm active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Profile
                </>
              )}
            </button>
          </div>

         
        </div>

        {/* Profile Found */}
        {searchResult === "found" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Profile Found
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User2 />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Nilakshi Perera
                    </h3>
                    <p className="text-sm text-gray-600">NIC: 199876543210</p>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-main to-[#06b6d4] text-white font-medium px-6 py-3 rounded-lg transition flex items-center gap-2"
                  onClick={() => navigate("/main/cus-profile")}
                >
                  Manage Profile
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Not Found */}
        {searchResult === "not-found" && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
              <Search className="w-10 h-10 text-main" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Profile Found
            </h2>
            <p className="text-gray-600 mb-2">
              A CRIB profile with the specified identifier does not exist.
            </p>
            <p className="text-gray-600 mb-8">
              You can create a new profile for this customer.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-main text-white font-medium px-6 py-3 rounded-lg transition"
              onClick={() => navigate("/main/create-crib-profile")}
            >
              <UserPlus className="w-5 h-5" />
              Create New CRIB Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
