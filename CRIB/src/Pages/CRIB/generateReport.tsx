import { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FileText, Loader2, PlusCircle, Trash2, Send, User, Mail, IdCard, Building2, CreditCard, DollarSign, Calendar, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "../../Store/hooks";
import { useLocation, useNavigate } from "react-router-dom";

const apiUrl: string = import.meta.env.VITE_API_URL;

interface CreditFacility {
  facilityId: string;
  institution: string;
  licenseNumber: string;
  facilityType: string;
  loanAmount: string;
  outstandingBalance: string;
  status: string;
  openedDate: string;
  closedDate: string;
  paymentHistory: any[];
}

interface FormValues {
  requestId: string;
  userName: string;
  nic: string;
  email: string;
  data: {
    nic: string;
    creditFacilities: CreditFacility[];
    totalFacilities: number;
    activeFacilities: number;
    closedFacilities: number;
    totalLoanAmount: string;
    totalOutstanding: string;
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
    onTimePaymentRatio: number;
    creditScore: number;
  };
}

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("User name is required"),
  nic: Yup.string().required("NIC is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  data: Yup.object().shape({
    creditFacilities: Yup.array()
      .of(
        Yup.object().shape({
          facilityId: Yup.string(),
          institution: Yup.string().required("Institution is required"),
          licenseNumber: Yup.string(),
          facilityType: Yup.string().required("Facility type is required"),
          loanAmount: Yup.string().required("Loan amount is required"),
          outstandingBalance: Yup.string().required("Outstanding balance is required"),
          status: Yup.string().required("Status is required"),
          openedDate: Yup.string().required("Opened date is required"),
          closedDate: Yup.string(),
        })
      )
      .min(1, "At least one facility is required"),
  }),
});

export default function GenerateReport() {
  const token = useAppSelector((state) => state.auth.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from navigation state
  const { requestId, nic, email } = location.state || {};

  // Create initial values based on passed data
  const initialValues: FormValues = {
    requestId: requestId || "",
    userName: "",
    nic: nic || "",
    email: email || "",
    data: {
      nic: nic || "",
      creditFacilities: [
        {
          facilityId: "",
          institution: "",
          licenseNumber: "",
          facilityType: "",
          loanAmount: "",
          outstandingBalance: "",
          status: "Active",
          openedDate: "",
          closedDate: "",
          paymentHistory: [],
        },
      ],
      totalFacilities: 0,
      activeFacilities: 0,
      closedFacilities: 0,
      totalLoanAmount: "",
      totalOutstanding: "",
      onTimePayments: 0,
      latePayments: 0,
      missedPayments: 0,
      onTimePaymentRatio: 0,
      creditScore: 0,
    },
  };

  // Show notification if data was received
  useEffect(() => {
    if (requestId) {
      console.log(`Generating report for request: ${requestId}`);
    }
  }, [requestId]);

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    try {
      const res = await fetch(`${apiUrl}crib/send/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to send report");
      }

      const result = await res.json();
      console.log(result);
      toast.success("Report sent successfully!");
      resetForm();
      
      // Navigate back to report approval page
      navigate("/reports");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-main rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate CRIB Report</h1>
              <p className="text-gray-600 text-sm">
                Create and send comprehensive credit reports
              </p>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting, resetForm }) => (
            <Form className="space-y-6">
              {/* Hidden Request ID Field */}
              <Field type="hidden" name="requestId" />

              {/* User Information Card */}
              <div className="bg-white rounded-3xl shadow-md border border-gray-100/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">User Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <Field
                        type="text"
                        name="userName"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter full name"
                      />
                    </div>
                    <ErrorMessage name="userName" component="p" className="text-red-500 text-xs mt-1.5 ml-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIC Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <Field
                        type="text"
                        name="nic"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter NIC number"
                        readOnly={!!nic}
                      />
                    </div>
                    <ErrorMessage name="nic" component="p" className="text-red-500 text-xs mt-1.5 ml-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter email address"
                        readOnly={!!email}
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1.5 ml-1" />
                  </div>
                </div>
              </div>

              {/* Credit Facilities Card */}
              <div className="bg-white rounded-3xl shadow-md border border-gray-100/50 p-8 backdrop-blur-sm">
                <FieldArray name="data.creditFacilities">
                  {({ push, remove }) => (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <h2 className="text-xl font-bold text-gray-900">Credit Facilities</h2>
                          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {values.data.creditFacilities.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            push({
                              facilityId: "",
                              institution: "",
                              licenseNumber: "",
                              facilityType: "",
                              loanAmount: "",
                              outstandingBalance: "",
                              status: "Active",
                              openedDate: "",
                              closedDate: "",
                              paymentHistory: [],
                            })
                          }
                          className="flex items-center gap-2 px-4 py-2.5 bg-main text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                          <PlusCircle className="w-5 h-5" />
                          Add Facility
                        </button>
                      </div>

                      <div className="space-y-4">
                        {values.data.creditFacilities.map((facility, index) => (
                          <div
                            key={index}
                            className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-all"
                          >
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                Facility #{index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (values.data.creditFacilities.length === 1) {
                                    toast.error("At least one facility is required");
                                    return;
                                  }
                                  remove(index);
                                }}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Remove facility"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                              {/* Facility ID */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  Facility ID
                                </label>
                                <Field
                                  type="text"
                                  name={`data.creditFacilities.${index}.facilityId`}
                                  placeholder="e.g., FAC-001"
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                              </div>

                              {/* Institution */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  <Building2 className="w-3.5 h-3.5 inline mr-1" />
                                  Institution *
                                </label>
                                <Field
                                  type="text"
                                  name={`data.creditFacilities.${index}.institution`}
                                  placeholder="e.g., Bank of Ceylon"
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <ErrorMessage
                                  name={`data.creditFacilities.${index}.institution`}
                                  component="p"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              {/* License Number */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  License Number
                                </label>
                                <Field
                                  type="text"
                                  name={`data.creditFacilities.${index}.licenseNumber`}
                                  placeholder="e.g., LIC-12345"
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                              </div>

                              {/* Facility Type */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  Facility Type *
                                </label>
                                <Field
                                  as="select"
                                  name={`data.creditFacilities.${index}.facilityType`}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                >
                                  <option value="">Select type</option>
                                  <option value="Personal Loan">Personal Loan</option>
                                  <option value="Home Loan">Home Loan</option>
                                  <option value="Vehicle Loan">Vehicle Loan</option>
                                  <option value="Credit Card">Credit Card</option>
                                  <option value="Business Loan">Business Loan</option>
                                  <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage
                                  name={`data.creditFacilities.${index}.facilityType`}
                                  component="p"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              {/* Loan Amount */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                                  Loan Amount *
                                </label>
                                <Field
                                  type="text"
                                  name={`data.creditFacilities.${index}.loanAmount`}
                                  placeholder="e.g., 500000"
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <ErrorMessage
                                  name={`data.creditFacilities.${index}.loanAmount`}
                                  component="p"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              {/* Outstanding Balance */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                  Outstanding Balance *
                                </label>
                                <Field
                                  type="text"
                                  name={`data.creditFacilities.${index}.outstandingBalance`}
                                  placeholder="e.g., 250000"
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <ErrorMessage
                                  name={`data.creditFacilities.${index}.outstandingBalance`}
                                  component="p"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              {/* Status */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  Status *
                                </label>
                                <Field
                                  as="select"
                                  name={`data.creditFacilities.${index}.status`}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Closed">Closed</option>
                                  <option value="Defaulted">Defaulted</option>
                                </Field>
                              </div>

                              {/* Opened Date */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                  Opened Date *
                                </label>
                                <Field
                                  type="date"
                                  name={`data.creditFacilities.${index}.openedDate`}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <ErrorMessage
                                  name={`data.creditFacilities.${index}.openedDate`}
                                  component="p"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              {/* Closed Date */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                  Closed Date
                                </label>
                                <Field
                                  type="date"
                                  name={`data.creditFacilities.${index}.closedDate`}
                                  disabled={facility.status === "Active"}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/report-approval")}
                  className="px-6 py-3.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-main text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate & Send Report
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}