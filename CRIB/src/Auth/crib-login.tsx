import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo/logo";
import AOS from "aos";
import "aos/dist/aos.css";
import { Buffer } from "buffer";
import { setAuthData } from "../Store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

window.Buffer = Buffer;

interface LoginFormValues {
  userName: string;
  password: string;
  bankId: string;
  creator: string;
}

const initialValues: LoginFormValues = {
  userName: "",
  password: "",
  bankId: "",
  creator: "",
};

const CRIBLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl: string = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  //  CRIB login
  const bankLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      const res = await fetch(`${apiUrl}crib/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      const data = await res.json();
      toast.success("Login Successful!");

      // Save CRIB auth data
      dispatch(
        setAuthData({
          auth: data.token,
          refresh: data.refreshToken,
          role: data.role || "crib",
          bankName: data.bankName,
          bankId: data.bankId,
          username: data.username,
        })
      );

      // Perform bank login after CRIB login
      const hardcodedBankPayload = {
        bankName: "BOC6",
        password: "Asdf123###",
      };

      const bankRes = await fetch(`${apiUrl}bank/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(hardcodedBankPayload),
      });

      if (bankRes.ok) {
        const bankData = await bankRes.json();
        console.log("Bank API Success:", bankData);

        // Save only mnemonic from bank API
         if (bankData?.mnemonic) {
          dispatch(
            setAuthData({
              auth: data.token,
              refresh: data.refreshToken,
              role: data.role || "crib",
              bankName: data.bankName,
              bankId: data.bankId,
              username: data.username,
              mnemonic: bankData.mnemonic,
            })
          );

          console.log("BANK API MNEMONIC", bankData.mnemonic);
        }
      } else {
        console.warn("Bank API failed");
      }

      // Navigate after successful login
      navigate("/crib-requests");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error("An error occurred during login");
    }
  };

  // Handle submit
  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Form Data:", values);
    await bankLogin(values);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-50 via-white to-purple-50 p-6 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div data-aos="fade-in">
          <Logo />
        </div>

        <div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mt-6"
          data-aos="zoom-in"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Employee Sign In</h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter your credentials to access the portal
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* User Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      name="userName"
                      placeholder="Enter User Name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="userName"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-xs mt-1"
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
                      Signing in...
                    </div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/crib-register")}
                className="text-main font-semibold transition"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRIBLogin;
