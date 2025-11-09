import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, Search } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import toast from "react-hot-toast";
import Pagination from "../../Components/Pagination/pagination";

interface ReportRequest {
  id: string;
  userName: string;
  nic: string;
  email: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function ReportApproval() {
  const token = useAppSelector((state) => state.auth.auth);

  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch report requests
 useEffect(() => {
  const fetchRequests = async (status: string, limit: string, offset: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${apiUrl}crib/report/requests?status=${encodeURIComponent(status)}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch requests");

      const result = await res.json();
      const data = Array.isArray(result) ? result : result.data || [];

      setRequests(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchRequests("Pending", "10", "0");
  }
}, [token]);


  // Approve or reject request
//   const handleRequestAction = async (
//     id: string,
//     action: "approve" | "reject"
//   ) => {
//     setProcessingIds((prev) => new Set(prev).add(id));

//     try {
//       // Construct URL with proper query params
//       const url = `${apiUrl}crib/report/requests?status=${action}&limit=10&offset=0`;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const errorData = await res.text();
//         throw new Error(errorData || "Action failed");
//       }

//       toast.success(`Request ${action}d successfully`);

//       // Update local state
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.id === id
//             ? { ...req, status: action === "approve" ? "Approved" : "Rejected" }
//             : req
//         )
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Something went wrong";
//       toast.error(errorMessage);
//     } finally {
//       setProcessingIds((prev) => {
//         const copy = new Set(prev);
//         copy.delete(id);
//         return copy;
//       });
//     }
//   };

  // Filter requests by search term
  const filteredRequests = requests.filter((req) =>
    req.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 if current page exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crib Report Requests</h1>
          <p className="text-gray-600">Approve or reject pending crib report requests</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600 font-medium">{error}</div>
          ) : currentItems.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              {searchTerm ? "No requests found matching your search" : "No pending requests"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex flex-col">
                {/* Header Row */}
                <div className="flex bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-600">
                  <div className="w-1/12 px-6 py-4">#</div>
                  <div className="w-3/12 px-6 py-4">User Name</div>
                  <div className="w-3/12 px-6 py-4">NIC</div>
                  <div className="w-2/12 px-6 py-4">Status</div>
                  <div className="w-3/12 px-6 py-4 text-center">Actions</div>
                </div>

                {/* Data Rows */}
                {currentItems.map((req, index) => {
                  const isProcessing = processingIds.has(req.id);
                  return (
                    <div
                      key={req.id}
                      className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <div className="w-1/12 px-6 py-4">{indexOfFirstItem + index + 1}</div>
                      <div className="w-3/12 px-6 py-4 font-medium">{req.userName}</div>
                      <div className="w-3/12 px-6 py-4 text-gray-600">{req.nic}</div>
                      <div className="w-2/12 px-6 py-4">
                        {req.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : req.status === "Rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </div>
                      <div className="w-3/12 px-6 py-4 flex justify-center gap-2">
                        {req.status === "Pending" ? (
                          <>
                            <button
                              disabled={isProcessing}
                            //   onClick={() => handleRequestAction(req.id, "approve")}
                              className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isProcessing ? "Processing..." : "Approve"}
                            </button>
                            <button
                              disabled={isProcessing}
                            //   onClick={() => handleRequestAction(req.id, "reject")}
                              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isProcessing ? "Processing..." : "Reject"}
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">No actions available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredRequests.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}