import { LogIn, Shield,Clock } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import { useState } from "react";
import toast from "react-hot-toast";

interface RequestValues {
  bankName: string;
  bankId: string;
}

export default function Dashboard() {
  const [status, setStatus] = useState(false); 
  const apiUrl: string = import.meta.env.VITE_API_URL;
  const authData = useAppSelector((state) => state.auth);
  const bankId = useAppSelector((state) => state.auth.bankId);
  const bankName = useAppSelector((state) => state.auth.bankName);

  console.log("bankId:", bankId);
  console.log("bankName:", bankName);
  console.log("Auth token in Redux:", authData.auth);

  // Add bank to CRIB network
  const addBankReq = async (values: RequestValues) => {
    try {
      const res = await fetch(`${apiUrl}bank/add/to/chain/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.auth}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Request Send Failed")
        console.error("Request Send Failed");
        return null;
      }

      const data = await res.json();
      toast.success("Request Sent Successful")
      console.log("Request Sent Successful", data);

      // Change button to “Pending Approval” after successful request
      setStatus(true);

      // optional: navigate or show success message
      // navigate("/main/customers");

      return data;
    } catch (error) {
      console.log("Request Send Failed", error);
    }
  };

  const handleJoinClick = async () => {
    const values: RequestValues = {
      bankName: bankName || "",
      bankId: bankId || "",
    };

    if (!values.bankId || !values.bankName) {
      console.error("Missing bankId or bankName in Redux:", values);
      return;
    }

    await addBankReq(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-r from-main to-[#06b6d4] rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-main to-[#06b6d4] bg-clip-text text-transparent">
            Join with CRIB
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Connect securely with CRIB to access credit information and manage your customers efficiently.
          </p>

          {/* Button */}
          {!status ? (
            <button
              onClick={handleJoinClick}
              className="w-full bg-main text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0  transition-opacity duration-300"></div>
              <LogIn className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="relative z-10">Join with CRIB</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 font-semibold py-4 px-8 rounded-xl cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Clock className="w-5 h-5 text-gray-500 animate-pulse" />
              <span>Pending Approval</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
