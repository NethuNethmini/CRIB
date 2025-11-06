import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, ChartNoAxesCombined, IdCardLanyard } from "lucide-react";

interface VerifyFormValues {
  nic: string;
}

const initialValues: VerifyFormValues = {
  nic: "",
};

const Verify: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const validationSchema = Yup.object().shape({
    nic: Yup.string().required("NIC is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Data:", values);
    alert("Login request submitted!");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-50 via-white to-purple-50 p-6 relative overflow-hidden"
      data-aos="fade-in"
    >
      {/* Login Card */}
      <div className="relative w-full max-w-md" data-aos="zoom-in">
        {/* Logo/Brand */}
        <div
          className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-gray-200/50 group cursor-pointer"
          data-aos="fade-down"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all duration-300">
              <ChartNoAxesCombined size={24} />
            </div>
            <div className="absolute -inset-1 bg-linear-to-r from-main to-[#06b6d4] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="font-bold text-2xl bg-linear-to-r from-main via-[#0284c7] to-[#06b6d4] bg-clip-text text-transparent tracking-tight">
              CRIB
            </h2>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              Network Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
          data-aos="fade-in"
        >
          <div className="mb-6" data-aos="fade-in" data-aos-delay="100">
            <h2 className="text-2xl text-center font-bold text-gray-900">
              Access Your CRIB Report
            </h2>
            <p className="text-gray-600 text-center text-sm mt-1">
              Please enter the NIC number you registered with
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form
                className="space-y-5"
                data-aos="fade-in"
                data-aos-delay="200"
              >
                {/* NIC Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IdCardLanyard className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      name="nic"
                      placeholder="e.g. 200021200123"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-300 transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="nic"
                    component="div"
                    className="text-red-500 text-xs mt-1.5 ml-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-main text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  data-aos="fade-in"
                  data-aos-delay="300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Verification Code
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

export default Verify;
