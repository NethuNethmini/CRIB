import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, SigningStargateClient } from "@cosmjs/stargate";
import { MsgCreateCreditFacility } from "../../../Proto/crib/creditfacility/v1/tx";
import { useAppSelector } from "../../Store/hooks";

interface FacilityForm {
  cribUsernic: string;
  licenseNumber: string;
  institution: string;
  facilityType: string;
  loanAmount: number;
  status: string;
  openedDate: string;
  closedDate: string;
  paymentHistory: string;
}

const initialValues: FacilityForm = {
  cribUsernic: "",
  licenseNumber: "",
  institution: "",
  facilityType: "",
  loanAmount: 0,
  status: "",
  openedDate: "",
  closedDate: "",
  paymentHistory: "",
};

const validationSchema = Yup.object({
  cribUsernic: Yup.string().required("CRIB User NIC is required"),
  licenseNumber: Yup.string().required("License Number is required"),
  institution: Yup.string().required("Institution is required"),
  facilityType: Yup.string().required("Facility Type is required"),
  loanAmount: Yup.string().required("Loan Amount is required"),
  status: Yup.string().required("Status is required"),
  openedDate: Yup.string().required("Opened Date is required"),
  closedDate: Yup.string().required("Closed Date is required"),
  paymentHistory: Yup.string().required("Payment History is required"),
});

export default function Facilities() {
  const RPC_ENDPOINT = "https://crib-blockchain-node.becx.io";
  const mnemonic = useAppSelector((state) => state.auth.mnemonic);
  console.log("This is mnemonic:", mnemonic);
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = async (values: FacilityForm) => {
    console.log("Form data:", values);
    await signAndBroadcast(mnemonic, values);
  };

  const signAndBroadcast = async (
    mnemonic: string,
    formData: FacilityForm
  ): Promise<void> => {
    try {
      console.log("Connecting to blockchain...");
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: "cosmos",
      });
      const [account] = await wallet.getAccounts();
      console.log("Using wallet:", account.address);

      // Register custom message type
      const registry = new Registry([
        ...defaultRegistryTypes,
        [
          "/crib.creditfacility.v1.MsgCreateCreditFacility",
          MsgCreateCreditFacility,
        ],
      ]);

      const client = await SigningStargateClient.connectWithSigner(
        RPC_ENDPOINT,
        wallet,
        { registry }
      );

      // Build the message
      const msg: MsgCreateCreditFacility = {
        creator: account.address,
        cribUsernic: formData.cribUsernic,
        licenseNumber: formData.licenseNumber,
        institution: formData.institution,
        facilityType: formData.facilityType,
        loanAmount: formData.loanAmount,
        status: formData.status,
        openedDate: formData.openedDate,
        closedDate: formData.closedDate,
        paymentHistory: [],
      };

      const msgAny = {
        typeUrl: "/crib.creditfacility.v1.MsgCreateCreditFacility",
        value: msg,
      };

      const fee = {
        amount: [{ denom: "stake", amount: "5000" }],
        gas: "200000",
      };

      console.log("Broadcasting transaction...");
      const result = await client.signAndBroadcast(
        account.address,
        [msgAny],
        fee
      );

      if (result.code === 0) {
        alert("Transaction successful!");
        console.log("Tx Hash:", result.transactionHash);
      } else {
        console.error("Transaction failed:", result);
        alert("Transaction failed: " + result.rawLog);
      }
    } catch (error) {
      console.error("Error while broadcasting:", error);
      alert("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <div className="flex-1 flex flex-col overflow-hidden max-w-5xl">
        <main className="flex-1 space-y-8">
          <div data-aos="fade-down" className="text-center">
            <h1 className="text-3xl font-bold text-main mb-2">
              Create Credit Facility
            </h1>
            <p className="text-gray-600">
              Submit new CRIB credit facility data to the blockchain.
            </p>
          </div>

          {/* Form */}
          <div
            data-aos="fade-up"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        CRIB User NIC
                      </label>
                      <Field
                        type="text"
                        name="cribUsernic"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="cribUsernic"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        License Number
                      </label>
                      <Field
                        type="text"
                        name="licenseNumber"
                        className="w-full px-4 py-2 border rounded-lg"
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
                      <label className="block text-sm font-medium mb-2">
                        Institution
                      </label>
                      <Field
                        type="text"
                        name="institution"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="institution"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Facility Type
                      </label>
                      <Field
                        type="text"
                        name="facilityType"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="facilityType"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Loan Amount
                      </label>
                      <Field
                        type="text"
                        name="loanAmount"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="loanAmount"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <Field
                        type="text"
                        name="status"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Opened Date
                      </label>
                      <Field
                        type="date"
                        name="openedDate"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="openedDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Closed Date
                      </label>
                      <Field
                        type="date"
                        name="closedDate"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <ErrorMessage
                        name="closedDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment History
                    </label>
                    <Field
                      as="textarea"
                      name="paymentHistory"
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <ErrorMessage
                      name="paymentHistory"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                    <button
                      type="reset"
                      className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-main text-white rounded-lg font-medium hover:scale-105 transition-transform"
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
