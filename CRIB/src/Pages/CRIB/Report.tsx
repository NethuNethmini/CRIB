/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, Search } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import toast from "react-hot-toast";
import Pagination from "../../Components/Pagination/pagination";
import { useNavigate } from "react-router-dom";

interface ReportRequest {
  id: string;
  nic: string;
  email: string;
  status: boolean;
}

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function ReportApproval() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.auth);
  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set()); // ✅ fixed line
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch report requests
  useEffect(() => {
    const fetchRequests = async (
      status: string,
      limit: string,
      offset: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${apiUrl}crib/report/requests?status=${encodeURIComponent(
            status
          )}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(
            offset
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch requests");

        const result = await res.json();
        const data = Array.isArray(result.rows) ? result.rows : [];
        setRequests(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
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

  // Approve request
  const handleApprove = async (values: { requestId: string; nic: string }) => {
    const { requestId, nic } = values;
    setProcessingIds((prev) => new Set(prev).add(requestId));

    try {
      const res = await fetch(`${apiUrl}crib/approve/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: String(requestId),
          nic: String(nic),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to approve report");
      }

      const result = await res.json();
      console.log("Approval success:", result);
      toast.success("Report approved successfully!");

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: true } : req
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      console.error("Approval failed:", errorMessage);
    } finally {
      setProcessingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
    }
  };

  // Navigate to generate report page
  const handleGenerateReport = (request: ReportRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));

    navigate("/generate-report", {
      state: {
        requestId: request.id,
        nic: request.nic,
        email: request.email,
      },
    });
  };

  // Search & Pagination
  const filteredRequests = requests.filter(
    (req) =>
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Requests</h1>
          <p className="text-gray-600">Approve Requests & Generate Reports</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or NIC..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
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
            <div className="py-20 text-center text-red-600 font-medium">
              {error}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              {searchTerm
                ? "No requests found matching your search"
                : "No pending requests"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-600">
                  <div className="w-1/12 px-6 py-4">#</div>
                  <div className="w-3/12 px-6 py-4">Email</div>
                  <div className="w-3/12 px-6 py-4">NIC</div>
                  <div className="w-2/12 px-6 py-4">Status</div>
                  <div className="w-3/12 px-6 py-4 text-center">Actions</div>
                </div>

                {/* Rows */}
                {currentItems.map((req, index) => {
                  const isProcessing = processingIds.has(req.id);
                  const isApproved = req.status === true;
                  const isPending = req.status === false;

                  return (
                    <div
                      key={req.id}
                      className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <div className="w-1/12 px-6 py-4">
                        {indexOfFirstItem + index + 1}
                      </div>
                      <div className="w-3/12 px-6 py-4 font-medium">
                        {req.email}
                      </div>
                      <div className="w-3/12 px-6 py-4 text-gray-600">
                        {req.nic}
                      </div>
                      <div className="w-2/12 px-6 py-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}
                      </div>
                      <div className="w-3/12 px-6 py-4 flex justify-center gap-2">
                        {isPending ? (
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleApprove({
                                requestId: req.id,
                                nic: req.nic,
                              })
                            }
                            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isProcessing ? "Processing..." : "Approve"}
                          </button>
                        ) : (
                          <button
                            disabled={isProcessing}
                            onClick={() => handleGenerateReport(req)}
                            className="px-4 py-2 bg-main text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Generate Report
                          </button>
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
