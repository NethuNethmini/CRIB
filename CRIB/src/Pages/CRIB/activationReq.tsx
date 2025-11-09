import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Search,
} from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import {
  defaultRegistryTypes,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { MsgCreateBankUser } from "../../../Proto/crib/user/v1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import toast from "react-hot-toast";
import Pagination from "../../Components/Pagination/pagination";

interface RequestItem {
  id: string;
  bankName: string;
  requestDate: string;
  bankId: string;
  licenseNumber: string;
  status: "Pending" | "Approved" | "Rejected";
}

const apiUrl: string = import.meta.env.VITE_API_URL;
const RPC_ENDPOINT: string = import.meta.env.VITE_RPC_ENDPOINT;

export default function ActivationReq() {
  const token = useAppSelector((state) => state.auth.auth);
  const mnemonic = useAppSelector((state) => state.wallet.mnemonic.mnemonic);

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const getAllReqs = async (status: string = "pending") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}crib/onchain/requests?status=${status}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      const mapped: RequestItem[] = data.requests.map((req: any, i: number) => ({
        id: `REQ-${(i + 1).toString().padStart(3, "0")}`,
        bankName: req.bankName,
        requestDate: new Date(req.createdAt).toLocaleDateString(),
        bankId: req.bankId,
        licenseNumber: req.licenseNumber,
        status:
          req.status === "pending"
            ? "Pending"
            : req.status === "approved"
            ? "Approved"
            : "Rejected",
      }));
      setRequests(mapped);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const signBankUser = async (bankName: string, bankId: string, requestId: string) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic!, {
        prefix: "cosmos",
      });
      const [account] = await wallet.getAccounts();
      const registry = new Registry([
        ...defaultRegistryTypes,
        ["/crib.user.v1.MsgCreateBankUser", MsgCreateBankUser],
      ]);
      const client = await SigningStargateClient.connectWithSigner(RPC_ENDPOINT, wallet, {
        registry,
      });

      const msg: MsgCreateBankUser = {
        creator: account.address,
        bankName,
        licenseNumber: bankId,
      };
      const msgAny = { typeUrl: "/crib.user.v1.MsgCreateBankUser", value: msg };
      const fee = { amount: [{ denom: "stake", amount: "5000" }], gas: "200000" };

      const txRaw = await client.sign(account.address, [msgAny], fee, "Create Bank User");
      const signBytes = TxRaw.encode(txRaw).finish();
      const signBytesBase64 = Buffer.from(signBytes).toString("base64");

      toast.loading("Broadcasting transaction...", { id: "broadcast" });
      const result = await fetch(`${apiUrl}bank/broadcast/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ txBytes: signBytesBase64, bankName }),
      }).then((r) => r.json());
      toast.dismiss("broadcast");

      if (result.status === "success") {
        toast.success("Bank user activated!");
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r))
        );
      } else {
        toast.error("Activation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to approve user");
    } finally {
      setProcessingIds((prev) => {
        const n = new Set(prev);
        n.delete(requestId);
        return n;
      });
    }
  };

  // Filter and paginate
  const filteredRequests = requests.filter((r) =>
    r.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (token) getAllReqs();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Activation Requests</h1>
          <p className="text-gray-600">Approve or reject pending bank activation requests</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bank name..."
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
            <div className="py-20 text-center text-gray-500">No pending requests</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex flex-col">
                {/* Header Row */}
                <div className="flex bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-600">
                  <div className="w-1/12 px-6 py-4">#</div>
                  <div className="w-3/12 px-6 py-4">Bank Name</div>
                  <div className="w-3/12 px-6 py-4">Request Date</div>
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
                      <div className="w-3/12 px-6 py-4 font-medium">{req.bankName}</div>
                      <div className="w-3/12 px-6 py-4 text-gray-600">{req.requestDate}</div>
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
                      <div className="w-3/12 px-6 py-4 flex justify-center gap-3">
                        {req.status === "Pending" && (
                          <button
                            disabled={isProcessing}
                            onClick={() => signBankUser(req.bankName, req.bankId, req.id)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2 transition-all"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Processing
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" /> Approve
                              </>
                            )}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </div>
  );
}
