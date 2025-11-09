import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  Calendar,
  IdCard,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, SigningStargateClient } from "@cosmjs/stargate";
import { MsgCreateCribAccount } from "../../../Proto/crib/user/v1/tx";
import { useAppSelector } from "../../Store/hooks";

const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT;

const AddUserForm = () => {
  const { username } = useAppSelector((state) => state.auth);

  const [nicFrontPreview, setNicFrontPreview] = useState<string | null>(null);
  const [nicBackPreview, setNicBackPreview] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const mnemonic = localStorage.getItem("mnemonic");
  const token = localStorage.getItem("token");

  const initialValues = {
    nic: "",
    fullname: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    nicFrontCid: null,
    nicBackCid: null,
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    nic: Yup.string().required("NIC is required"),
  });

  const handleFileUpload = async (
    file: File,
    setPreview: (url: string | null) => void,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string,
    setUploading: (loading: boolean) => void
  ) => {
    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFieldValue(fieldName, file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const createCribAccount = async (
    nic: string,
    fullname: string,
    phoneNumber: string,
    dateOfBirth: string,
    email: string,
  ) => {
    if (!mnemonic || !token) {
      toast.error("Authentication required. Please login.");
      return;
    }

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
      const [account] = await wallet.getAccounts();
      const walletAddress = account.address;

      const registry = new Registry([
        ...defaultRegistryTypes,
        ["/crib.user.v1.MsgCreateCribAccount", MsgCreateCribAccount],
      ]);

      const client = await SigningStargateClient.connectWithSigner(RPC_ENDPOINT!, wallet, { registry });

      const msg: MsgCreateCribAccount = {
        creator: walletAddress,
        createdBy: username,
        nic,
        fullname,
        phoneNumber,
        dateOfBirth,
        email,
      };

      const fee = {
        amount: [{ denom: "stake", amount: "500" }],
        gas: "200000",
      };

      const result = await client.signAndBroadcast(walletAddress, [{ typeUrl: "/crib.user.v1.MsgCreateCribAccount", value: msg }], fee);

      if (result.code === 0) {
        toast.success("Crib account created successfully!");
        console.log("Tx result:", result);
      } else {
        toast.error("Transaction failed: " + result.rawLog);
        console.error("Tx failed:", result);
      }
    } catch (err) {
      console.error("Error creating Crib account:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    await createCribAccount(
      values.nic,
      values.fullname,
      values.phoneNumber,
      values.dateOfBirth,
      values.email,
    );

    resetForm();
    setNicFrontPreview(null);
    setNicBackPreview(null);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-main mb-6">Add New User</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <FormInput name="fullname" label="Full Name" icon={<User />} placeholder="John Doe" />
                <FormInput name="email" label="Email" icon={<Mail />} placeholder="example@mail.com" type="email" />
                <FormInput name="phoneNumber" label="Phone Number" icon={<Phone />} placeholder="+94 712 345 678" />
                <FormInput name="dateOfBirth" label="Date of Birth" icon={<Calendar />} type="date" />
              </div>

              <FormInput name="nic" label="NIC" icon={<IdCard />} placeholder="200012345678" />

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <UploadCard
                  label="Upload NIC Front"
                  uploading={uploadingFront}
                  preview={nicFrontPreview}
                  onFile={(file) => handleFileUpload(file, setNicFrontPreview, setFieldValue, "nicFrontCid", setUploadingFront)}
                />
                <UploadCard
                  label="Upload NIC Back"
                  uploading={uploadingBack}
                  preview={nicBackPreview}
                  onFile={(file) => handleFileUpload(file, setNicBackPreview, setFieldValue, "nicBackCid", setUploadingBack)}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 mt-6 text-white bg-main rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding User..." : "Add User"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUserForm;

// Reusable Input
interface FormInputProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
}
const FormInput: React.FC<FormInputProps> = ({ name, label, icon, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
      <Field name={name} placeholder={placeholder} type={type} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
    <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
  </div>
);

// Upload Card
interface UploadCardProps {
  label: string;
  uploading: boolean;
  preview: string | null;
  onFile: (file: File) => void;
}
const UploadCard: React.FC<UploadCardProps> = ({ label, uploading, preview, onFile }) => (
  <motion.div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden hover:shadow-lg transition-all" whileHover={{ scale: 1.02 }}>
    {!preview ? (
      <label className="flex flex-col items-center justify-center w-full h-full">
        {uploading ? (
          <motion.div className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="text-main animate-spin mb-2" size={28} />
            <span className="text-sm text-gray-600">Uploading...</span>
          </motion.div>
        ) : (
          <>
            <Upload className="text-main mb-2" />
            <span className="text-sm text-gray-600">{label}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </>
        )}
      </label>
    ) : (
      <motion.div className="relative w-full h-full group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <img src={preview} alt={label} className="object-cover w-full h-full rounded-xl" />
        <motion.div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-all" whileHover={{ scale: 1.05 }}>
          <CheckCircle className="mr-2 text-green-400" /> Uploaded
        </motion.div>
      </motion.div>
    )}
  </motion.div>
);
