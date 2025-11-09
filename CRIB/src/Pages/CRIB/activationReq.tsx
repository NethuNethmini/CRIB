import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import { defaultRegistryTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { MsgCreateBankUser } from "../../../Proto/crib/user/v1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import toast from "react-hot-toast";

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

const ActivationReq = () => {
  const token = useAppSelector((state) => state.auth.auth);
  const mnemonic = useAppSelector((state) => state.wallet.mnemonic.mnemonic);

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getAllReqs = async (status: string = "pending") => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}crib/onchain/requests?status=${status}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed: ${res.statusText}`);

      const data = await res.json();
      const mapped: RequestItem[] = data.requests.map((req: any, index: number) => ({
        id: `REQ-${(index + 1).toString().padStart(3, "0")}`,
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
      console.error("Error fetching requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWalletAddress = async (): Promise<string | null> => {
    if (!mnemonic) {
      console.error("Mnemonic not found");
      return null;
    }
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
    const [account] = await wallet.getAccounts();
    return account.address;
  };

  const broadcastToOnchain = async (txBytes: string, bankName: string) => {
    try {
      const res = await fetch(`${apiUrl}bank/broadcast/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ txBytes, bankName }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Broadcast failed: ${errText}`);
      }

      const result = await res.json();
      toast.success("Bank user activated successfully!");
      await getAllReqs();
      return result;
    } catch (error) {
      console.error("Error broadcasting transaction:", error);
      toast.error("Bank user activated Failed.");
      throw error;
    }
  };

  const signBankUser = async (bankName: string, bankId: string, requestId: string) => {
    try {
      if (!mnemonic || !token) {
        alert("Mnemonic or token missing");
        return;
      }

      const walletAddress = await getWalletAddress();
      if (!walletAddress) {
        alert("Wallet address not available");
        return;
      }

      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
      const [account] = await wallet.getAccounts();

      const faucetRes = await fetch(`${apiUrl}bank/faucet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress: account.address }),
      });

      if (!faucetRes.ok) {
        const errText = await faucetRes.text();
        alert("Faucet request failed: " + errText);
        return;
      }

      await new Promise((r) => setTimeout(r, 3000));

      const registry = new Registry([
        ...defaultRegistryTypes,
        ["/crib.user.v1.MsgCreateBankUser", MsgCreateBankUser],
      ]);

      const client = await SigningStargateClient.connectWithSigner(RPC_ENDPOINT, wallet, { registry });

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

      await broadcastToOnchain(signBytesBase64, bankName);

      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "Approved" } : req))
      );
    } catch (error) {
      console.error("Error signing bank user:", error);
      alert("Failed to approve bank user");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-medium">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
    }
  };

  useEffect(() => {
    getAllReqs();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = requests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
    
      
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
         <div className="text-xl font-semibold text-main mb-4">Approval Requests</div>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : currentItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No requests found.</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <div className="grid grid-cols-5 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <div>Request ID</div>
                <div>Bank Name</div>
                <div>Request Date</div>
                <div>Status</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {currentItems.map((req) => (
                  <div
                    key={req.id}
                    className="grid grid-cols-5 items-center py-4 px-4 hover:bg-sky-50 transition-colors duration-200 text-sm"
                  >
                    <div className="font-medium text-gray-900">{req.id}</div>
                    <div className="text-gray-700">{req.bankName}</div>
                    <div className="text-gray-800">{req.requestDate}</div>
                    <div>{getStatusBadge(req.status)}</div>

                    <div className="flex justify-center gap-2">
                      {req.status === "Pending" ? (
                        <>
                          <button
                            className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                            onClick={() => signBankUser(req.bankName, req.bankId, req.id)}
                          >
                            Approve
                          </button>
                          <button className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors">
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No actions</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationReq;
