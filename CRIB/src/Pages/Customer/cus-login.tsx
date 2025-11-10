import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Mail, User, IdCard, Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo/logo";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

interface RegisterFormValues {
  userName: string;
  nic: string;
  nicFront: File | null;
  nicBack: File | null;
  email: string;
}

const initialValues: RegisterFormValues = {
  userName: "",
  nic: "",
  nicFront: null,
  nicBack: null,
  email: "",
};

const CustomerLogin: React.FC = () => {
  const apiUrl: string = import.meta.env.VITE_API_URL;
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    nic: Yup.string().required("NIC number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    nicFront: Yup.mixed().required("Front side of NIC is required"),
    nicBack: Yup.mixed().required("Back side of NIC is required"),
  });

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit function with raw JSON
  const submitCribReport = async (values: RegisterFormValues) => {
    try {
      // Convert files to base64
      const nicFrontBase64 = values.nicFront ? await fileToBase64(values.nicFront) : "";
      const nicBackBase64 = values.nicBack ? await fileToBase64(values.nicBack) : "";

      // Create payload
      const payload = {
        userName: values.userName,
        nic: values.nic,
        nicFront: nicFrontBase64,
        nicBack: nicBackBase64,
        email: values.email,
      };

      // Console log for debugging 
      console.log("Payload structure:", {
        userName: payload.userName,
        nic: payload.nic,
        email: payload.email,
        nicFront: nicFrontBase64 ? `base64 string (${nicFrontBase64.length} chars)` : "empty",
        nicBack: nicBackBase64 ? `base64 string (${nicBackBase64.length} chars)` : "empty",
      });

      const res = await fetch(`${apiUrl}users/request/crib/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Report submission failed:", errText);
        toast.error("Report submission failed");
        return;
      }

      const data = await res.json();
      console.log("Report submitted successfully:", data);
      toast.success("Report submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting report");
    }
  };

  // Handle submit
  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("Submitting form...");
    await submitCribReport(values);
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (previewFront) URL.revokeObjectURL(previewFront);
      if (previewBack) URL.revokeObjectURL(previewBack);
    };
  }, [previewFront, previewBack]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 relative overflow-hidden">
      <div className="relative w-full max-w-lg">
        <div data-aos="fade-in">
          <Logo />
        </div>

        <div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mt-6"
          data-aos="zoom-in"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-4">
                {/* User Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <Field
                      type="text"
                      name="userName"
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="userName"
                    component="p"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Number
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <Field
                      type="text"
                      name="nic"
                      placeholder="Enter your NIC"
                      className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="nic"
                    component="p"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* NIC Front Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Front Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue("nicFront", file);
                        if (file) {
                          // Revoke previous URL to prevent memory leaks
                          if (previewFront) URL.revokeObjectURL(previewFront);
                          setPreviewFront(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                      id="nicFront"
                    />
                    <label
                      htmlFor="nicFront"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {previewFront ? (
                        <img
                          src={previewFront}
                          alt="NIC Front"
                          className="w-36 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Upload NIC Front
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  <ErrorMessage
                    name="nicFront"
                    component="p"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* NIC Back Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Back Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue("nicBack", file);
                        if (file) {
                          // Revoke previous URL to prevent memory leaks
                          if (previewBack) URL.revokeObjectURL(previewBack);
                          setPreviewBack(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                      id="nicBack"
                    />
                    <label
                      htmlFor="nicBack"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {previewBack ? (
                        <img
                          src={previewBack}
                          alt="NIC Back"
                          className="w-36 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Upload NIC Back
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  <ErrorMessage
                    name="nicBack"
                    component="p"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-main text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Applying
                    </div>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;