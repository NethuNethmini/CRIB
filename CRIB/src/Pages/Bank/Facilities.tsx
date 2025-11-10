import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, SigningStargateClient } from "@cosmjs/stargate";
import { MsgCreateCreditFacility } from "../../../Proto/crib/creditfacility/v1/tx";
import { PaymentRecord, FacilityStatus } from "../../../Proto/crib/creditfacility/v1/credit_facility";
import { useAppSelector } from "../../Store/hooks";
import toast from "react-hot-toast";
import { Plus, Trash2, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

interface PaymentHistoryItem {
  date: string;
  amount: number;
  status: number;
  paymentId: string;
}

interface FacilityForm {
  cribUsernic: string;
  licenseNumber: string;
  institution: string;
  facilityType: string;
  loanAmount: string;
  status: FacilityStatus | "";
  openedDate: string;
  closedDate: string;
}

const initialValues: FacilityForm = {
  cribUsernic: "",
  licenseNumber: "",
  institution: "",
  facilityType: "",
  loanAmount: "",
  status: "",
  openedDate: "",
  closedDate: "",
};

const validationSchema = Yup.object({
  cribUsernic: Yup.string().required("CRIB User NIC is required"),
  licenseNumber: Yup.string().required("License Number is required"),
  institution: Yup.string().required("Institution is required"),
  facilityType: Yup.string().required("Facility Type is required"),
  loanAmount: Yup.number()
    .required("Loan Amount is required")
    .positive("Loan Amount must be positive"),
  status: Yup.number()
    .required("Status is required")
    .oneOf(
      [FacilityStatus.ACTIVE, FacilityStatus.CLOSED, FacilityStatus.DEFAULTED],
      "Invalid status"
    ),
  openedDate: Yup.string().required("Opened Date is required"),
});

export default function Facilities() {
  const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT;
  const API_URL = import.meta.env.VITE_API_URL;
  const mnemonic = useAppSelector((state) => state.auth.mnemonic) || "";
  const token = useAppSelector((state) => state.auth.auth);
  const bankName = useAppSelector((state) => state.auth.bankName);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(1);
  const [paymentStatus, setPaymentStatus] = useState<number>(1);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const addPayment = () => {
    if (!paymentDate || !paymentAmount) {
      toast.error("Please fill payment date and amount");
      return;
    }

    const newPayment: PaymentHistoryItem = {
      date: paymentDate,
      amount: paymentAmount,
      status: paymentStatus,
      paymentId: paymentId || Math.random().toString(36).substring(2, 10),
    };

    setPaymentHistory([...paymentHistory, newPayment]);
    setPaymentDate("");
    setPaymentAmount(1);
    setPaymentStatus(1);
    setPaymentId("");
    toast.success("Payment added to history");
  };

  const removePayment = (index: number) => {
    setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
    toast.success("Payment removed");
  };

  const createFacility = async (txBytes: Uint8Array, bankName: string) => {
    try {
      const res = await fetch(`${API_URL}bank/broadcast/create/credit/facility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ txBytes: Array.from(txBytes), bankName }),
      });

      if (res.ok) {
        toast.success("Credit Facility broadcasted to backend");
      } else {
        const text = await res.text();
        toast.error("Backend broadcast failed: " + (text || res.statusText));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while broadcasting to backend");
    }
  };

  const signAndBroadcast = async (formData: FacilityForm) => {
    if (!mnemonic) {
      toast.error("Mnemonic not found. Please login.");
      return;
    }

    if (!RPC_ENDPOINT) {
      toast.error("RPC endpoint is not configured.");
      return;
    }

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { 
        prefix: "cosmos" 
      });
      const [account] = await wallet.getAccounts();

      const registry = new Registry([
        ...defaultRegistryTypes,
        ["/crib.creditfacility.v1.MsgCreateCreditFacility", MsgCreateCreditFacility],
      ]);

      const client = await SigningStargateClient.connectWithSigner(
        RPC_ENDPOINT, 
        wallet, 
        { registry }
      );

      const paymentRecords: PaymentRecord[] = paymentHistory.map((p) => ({
        date: p.date,
        amount: p.amount,
        status: p.status,
        paymentId: p.paymentId,
      }));

      const msg: MsgCreateCreditFacility = {
        creator: account.address,
        cribUsernic: formData.cribUsernic,
        licenseNumber: formData.licenseNumber,
        institution: formData.institution,
        facilityType: formData.facilityType,
        loanAmount: parseFloat(formData.loanAmount),
        status: Number(formData.status),
        openedDate: formData.openedDate,
        closedDate: formData.closedDate || "",
        paymentHistory: paymentRecords,
        
      };

      const msgAny = {
        typeUrl: "/crib.creditfacility.v1.MsgCreateCreditFacility",
        value: msg,
      };

      const fee = { 
        amount: [{ denom: "stake", amount: "5000" }], 
        gas: "200000" 
      };

      toast.loading("Broadcasting transaction...", { id: "broadcast" });

      // Broadcast transaction
      const result = await client.signAndBroadcast(
        account.address, 
        [msgAny], 
        fee, 
        "Create Credit Facility"
      );

      toast.dismiss("broadcast");

      if (result.code === 0) {
        toast.success("Blockchain transaction successful! Tx Hash: " + result.transactionHash);

        // Get signed tx bytes to send to backend
        const signedTx = await client.sign(
          account.address, 
          [msgAny], 
          fee, 
          "Create Credit Facility"
        );

        // Convert signed tx to raw bytes
        const txBytes = TxRaw.encode(signedTx).finish();

        if (bankName) {
          await createFacility(txBytes, bankName);
        } else {
          toast.error("Bank name missing, cannot broadcast to backend");
        }
      } else {
        toast.error("Transaction failed: " + result.rawLog);
      }
    } catch (error) {
      toast.dismiss("broadcast");
      toast.error("Error: " + (error as Error).message);
      console.error(error);
    }
  };

  const handleSubmit = async (values: FacilityForm, { resetForm }: any) => {
    await signAndBroadcast(values);
    resetForm();
    setPaymentHistory([]);
  };

  return (
    <div className="p-6 w-full flex justify-center bg-gray-50 min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden max-w-5xl">
        <main className="flex-1 space-y-8">
          <div data-aos="" className="text-center">
            <h1 className="text-3xl font-bold text-main mb-2">Create Credit Facility</h1>
            <p className="text-gray-600">.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema} 
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">CRIB User NIC</label>
                      <Field 
                        type="text" 
                        name="cribUsernic" 
                        placeholder="199012345678" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="cribUsernic" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">License Number</label>
                      <Field 
                        type="text" 
                        name="licenseNumber" 
                        placeholder="CBC2024999" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="licenseNumber" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Institution</label>
                      <Field 
                        type="text" 
                        name="institution" 
                        placeholder="Acme Bank PLC" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="institution" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Facility Type</label>
                      <Field 
                        as="select" 
                        name="facilityType" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="PERSONAL_LOAN">Personal Loan</option>
                        <option value="HOME_LOAN">Home Loan</option>
                        <option value="VEHICLE_LOAN">Vehicle Loan</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="BUSINESS_LOAN">Business Loan</option>
                        <option value="OVERDRAFT">Overdraft</option>
                      </Field>
                      <ErrorMessage 
                        name="facilityType" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Amount</label>
                      <Field 
                        type="number" 
                        name="loanAmount" 
                        placeholder="500000" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="loanAmount" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Field 
                        as="select" 
                        name="status" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option value={FacilityStatus.ACTIVE}>Active</option>
                        <option value={FacilityStatus.CLOSED}>Closed</option>
                        <option value={FacilityStatus.DEFAULTED}>Defaulted</option>
                      </Field>
                      <ErrorMessage 
                        name="status" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Opened Date</label>
                      <Field 
                        type="date" 
                        name="openedDate" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="openedDate" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Closed Date (Optional)</label>
                      <Field 
                        type="date" 
                        name="closedDate" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <ErrorMessage 
                        name="closedDate" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>

                  {/* Payment History Section */}
                  <div className="bg-gray-50 p-6 rounded-xl mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment History</h3>
                    <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            placeholder="25000"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>Paid</option>
                          <option value={0}>Pending</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button 
                          type="button" 
                          onClick={addPayment} 
                          className="w-full py-2 bg-main text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={18} /> Add Payment
                        </button>
                      </div>
                    </div>

                    {paymentHistory.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Added Payments ({paymentHistory.length})
                        </h4>
                        {paymentHistory.map((payment, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between bg-white p-3 rounded-lg "
                          >
                            <div className="flex gap-4 text-sm">
                              <span className="font-medium">{payment.date}</span>
                              <span className="text-green-600 font-semibold">
                                ${payment.amount.toLocaleString()}
                              </span>
                              <span 
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                  payment.status === 1 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {payment.status === 1 ? "Paid" : "Pending"}
                              </span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removePayment(index)} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 ">
                    <button 
                      type="reset" 
                      onClick={() => setPaymentHistory([])} 
                      className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="px-6 py-2 bg-main text-white rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </main>
      </div>
    </div>
  );
}