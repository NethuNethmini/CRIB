import { LogIn, Shield, Clock } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface RequestValues {
  bankName: string;
  bankId: string;
  licenseNumber: string;
}

interface StatusResponse {
  status: string;
  approved: boolean;
  message?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("not_requested");
  const apiUrl: string = import.meta.env.VITE_API_URL;
  const authData = useAppSelector((state) => state.auth);
  const bankId = useAppSelector((state) => state.auth.bankId);
  const bankName = useAppSelector((state) => state.auth.bankName);
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Add bank to CRIB network
  const addBankReq = async (values: RequestValues) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}bank/add/to/chain/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.auth}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.message || "Request Send Failed");
        return null;
      }

      const data = await res.json();
      toast.success("Request Sent Successfully");
      setLicenseNumber("");
      setStatus("pending");
      return data;
    } catch (error) {
      toast.error("Network error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check approval status
  const getStatus = async () => {
    if (!bankId || !bankName) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}bank/get/status?bankId=${encodeURIComponent(
          bankId
        )}&bankName=${encodeURIComponent(bankName)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.auth}`,
          },
        }
      );

      if (res.ok) {
        const data: StatusResponse = await res.json();
        if (data.approved) {
          setStatus("approved");
          navigate("/abc");
        } else if (data.status === "pending") {
          setStatus("pending");
        } else {
          setStatus("not_requested");
        }
      } else {
        if (res.status === 404) setStatus("not_requested");
      }
    } catch (error) {
      toast.error("Failed to check approval status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bankId && bankName && authData.auth) getStatus();
  }, [bankId, bankName, authData.auth]);

  const handleJoinClick = async () => {
    if (!bankId || !bankName) {
      toast.error("Missing bank information. Please log in again.");
      return;
    }
    if (!authData.auth) {
      toast.error("Authentication required. Please log in again.");
      return;
    }
    if (!licenseNumber.trim()) {
      toast.error("License Number is required");
      return;
    }

    await addBankReq({ bankName, bankId, licenseNumber });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-main rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              {status === "approved" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
              )}
              {status === "pending" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white animate-pulse"></div>
              )}
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-main bg-clip-text text-transparent">
            Join with CRIB
          </h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Connect securely with CRIB to access credit information and manage your customers efficiently.
          </p>

          {/* License Number Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Status Information */}
          {loading ? (
            <div className="mb-6 py-4">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Clock className="w-5 h-5 animate-spin" />
                <span>Checking status...</span>
              </div>
            </div>
          ) : status === "approved" && (
            <div className="mb-6 py-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Your bank is approved and connected to CRIB!
              </p>
            </div>
          )}

          {/* Button */}
          {status === "not_requested" ? (
            <button
              onClick={handleJoinClick}
              disabled={loading || !licenseNumber.trim()}
              className="w-full bg-main text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Clock className="w-5 h-5 relative z-10 animate-spin" />
                  <span className="relative z-10">Processing...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <span className="relative z-10">Join with CRIB</span>
                </>
              )}
            </button>
          ) : status === "pending" ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white font-semibold py-4 px-8 rounded-xl cursor-not-allowed flex items-center justify-center gap-3 opacity-90"
            >
              <Clock className="w-5 h-5 animate-pulse" />
              <span>Pending Approval</span>
            </button>
          ) : status === "approved" ? (
            <button
              disabled
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-8 rounded-xl cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Shield className="w-5 h-5" />
              <span>Connected to CRIB</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
