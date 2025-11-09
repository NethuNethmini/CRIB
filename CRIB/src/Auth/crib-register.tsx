import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Lock, Eye, EyeOff, ArrowRight, Check, User } from "lucide-react";
import Logo from "../Components/Logo/logo";
import AOS from "aos";
import "aos/dist/aos.css";


interface RegisterFormValues {
  userName: string;
  password: string;
  confirmPassword: string;
}

const CRIBRegister: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const apiUrl: string = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object({
    userName: Yup.string().required("User name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords do not match")
      .required("Please confirm your password"),
  });

  const initialValues: RegisterFormValues = {
    userName: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  // Register CRIB Member
  const cribMemberReg = async (values: RegisterFormValues) => {
    try {
      const res = await fetch(`${apiUrl}crib`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        console.error("Bank Register Failed");
        return null;
      }

      const data = await res.json();
      console.log("Bank Registered:", data);
      return data;
    } catch (error) {
      console.error("Bank Register Failed:", error);
      return null;
    }
  };

  
  //Handle Form Submit
  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("Form Data:", values);

    //  Register CRIB Member
    const bankResponse = await cribMemberReg(values);
    if (!bankResponse) return;

    const bankId = bankResponse?.bankId;
    const token = bankResponse?.token;
    console.log("Bank ID:", bankId, "Token:", token);

    // Navigate after success
    navigate("/login");
  };

  // Password rules
  const getPasswordRequirements = (password: string) => [
    { text: "Minimum 8 Characters", met: password.length >= 8 },
    { text: "Includes at least one number", met: /\d/.test(password) },
    {
      text: "Includes at least one special character (!@#$%)",
      met: /[!@#$%]/.test(password),
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-50 via-white to-purple-50 p-6 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div data-aos="fade-in">
          <Logo />
        </div>

        <div
          className="relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 z-10 mt-6"
          data-aos="zoom-in"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-5">
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                    <Field
                      type="text"
                      name="userName"
                      placeholder="Enter User Name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="userName"
                    component="div"
                    className="text-red-500 text-[.7rem] absolute lg:right-30 md:right-10 right-14 font-bold animate__animated animate__fadeIn"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-[.7rem] absolute lg:right-30 md:right-10 right-14 font-bold animate__animated animate__fadeIn"
                  />

                  <div className="mt-2 space-y-1">
                    {getPasswordRequirements(values.password).map((req, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[14px]"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            req.met ? "bg-main/20" : "bg-gray-100"
                          }`}
                        >
                          {req.met && (
                            <Check className="w-2.5 h-2.5 text-main" />
                          )}
                        </div>
                        <span
                          className={`${
                            req.met ? "text-main" : "text-gray-500"
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-[.7rem] absolute lg:right-30 md:right-10 right-14 font-bold animate__animated animate__fadeIn"
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
                      Submitting ...
                    </div>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already Registered?{" "}
                  <span
                    onClick={() => navigate("/crib-login")}
                    className="text-main font-semibold cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CRIBRegister;
