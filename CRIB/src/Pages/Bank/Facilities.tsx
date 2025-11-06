import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CRIBPortal() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const initialValues = {
    reportingDate: "",
    lastPaymentDate: "",
    outstandingBalance: "0.00",
    lastPaymentAmount: "0.00",
    paymentStatus: "Current",
  };

  const validationSchema = Yup.object({
    reportingDate: Yup.string().required("Reporting date is required"),
    lastPaymentDate: Yup.string().required("Last payment date is required"),
    outstandingBalance: Yup.number()
      .typeError("Must be a valid number")
      .required("Outstanding balance is required"),
    lastPaymentAmount: Yup.number()
      .typeError("Must be a valid number")
      .required("Last payment amount is required"),
    paymentStatus: Yup.string().required("Payment status is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const formData = {
      loanAccount: "ACC-001234567B",
      customer: "Jane Smith",
      nic: "901234567V",
      ...values,
    };

    console.log("Submitting data:", formData);
    alert("CRIB data update submitted successfully!");
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <div className="flex-1 flex flex-col overflow-hidden max-w-5xl">
        <main className="flex-1 space-y-8">
          <div data-aos="fade-down" className="text-center">
            <h1 className="text-3xl font-bold text-main mb-2">
              Submit CRIB Data Update
            </h1>
            <p className="text-gray-600">
              Update financial information for a customer's credit facility.
            </p>
          </div>

          {/* Account Info Card */}
          <div
            data-aos="fade-up"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="grid grid-cols-3 gap-6 text-gray-700">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Loan Account
                </label>
                <div className="text-base font-semibold text-gray-900">
                  ACC-001234567B
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Customer</label>
                <div className="text-base font-semibold text-gray-900">
                  Jane Smith
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">NIC/ID</label>
                <div className="text-base font-semibold text-gray-900">
                  901234567V
                </div>
              </div>
            </div>
          </div>

          {/* Formik Form */}
          <div
            data-aos="fade-up"
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-main/80 mb-6">
              New Financial Data
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reporting Date
                      </label>
                      <Field
                        type="date"
                        name="reportingDate"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                      <ErrorMessage
                        name="reportingDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Outstanding Balance
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          LKR
                        </span>
                        <Field
                          type="text"
                          name="outstandingBalance"
                          className="w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <ErrorMessage
                        name="outstandingBalance"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Payment Date
                      </label>
                      <Field
                        type="date"
                        name="lastPaymentDate"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                      <ErrorMessage
                        name="lastPaymentDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Payment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          LKR
                        </span>
                        <Field
                          type="text"
                          name="lastPaymentAmount"
                          className="w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <ErrorMessage
                        name="lastPaymentAmount"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <Field
                      as="select"
                      name="paymentStatus"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                    >
                      <option>Current</option>
                      <option>30 Days Past Due</option>
                      <option>60 Days Past Due</option>
                      <option>90 Days Past Due</option>
                      <option>120+ Days Past Due</option>
                      <option>Settled</option>
                      <option>Written Off</option>
                    </Field>
                    <ErrorMessage
                      name="paymentStatus"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="reset"
                      className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-main text-white rounded-lg font-medium hover:scale-105 transition-transform duration-300"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Update"}
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
