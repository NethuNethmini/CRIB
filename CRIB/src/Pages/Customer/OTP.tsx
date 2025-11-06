import React, { useEffect, useRef, type JSX } from "react";
import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import Lock from "../../assets/lock.gif"
import AOS from "aos";
import "aos/dist/aos.css";

interface VerificationValues {
  code: string[];
}

export default function VerificationCode(): JSX.Element {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-out-cubic",
      });
    }, []);


  // Validation schema
  const validationSchema = Yup.object().shape({
    code: Yup.array()
      .of(
        Yup.string()
          .matches(/^\d$/, "Must be a single digit")
          .required("Required")
      )
      .length(6, "Must be exactly 6 digits"),
  });

  // Handle paste
  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newCode = pasted.split("");
    for (let i = 0; i < 6; i++) {
      setFieldValue(`code[${i}]`, newCode[i] || "");
    }

    const nextIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    values: VerificationValues,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    setFieldValue(`code[${index}]`, value);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    values: VerificationValues
  ) => {
    if (e.key === "Backspace" && !values.code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Form submit
  const handleSubmit = (
    values: VerificationValues,
    { setSubmitting }: FormikHelpers<VerificationValues>
  ) => {
    const fullCode = values.code.join("");
    if (fullCode.length === 6) {
      console.log("Verifying code:", fullCode);
      //weded
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col" data-aos="zoom-in">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-8">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center">
             
                <img src={Lock} className="w-16 h-16" />
             
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Enter Verification Code
          </h2>

          <p className="text-gray-500 text-center mb-8">
            We sent a 6-digit code to{" "}
            <span className="text-gray-700">••••••••1234</span>
          </p>

          {/*Form */}
          <Formik
            initialValues={{ code: Array(6).fill("") }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isValid }) => (
              <Form>
                <div
                  className="flex justify-center gap-3 mb-8"
                  onPaste={(e) => handlePaste(e, setFieldValue)}
                >
                  {values.code.map((digit, index) => (
                    <Field key={index} name={`code[${index}]`}>
                      {() => (
                        <input
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          aria-label={`Digit ${index + 1}`}
                          onChange={(e) =>
                            handleChange(e, index, values, setFieldValue)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index, values)}
                          className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg"
                        />
                      )}
                    </Field>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={values.code.join("").length !== 6 || !isValid}
                  className="w-full bg-main text-white py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-6 cursor-pointer"
                >
                  Verify & Log In
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center text-gray-500">
            Didn’t receive a code?{" "}
            <button
              type="button"
              onClick={() => console.log("Resend code")}
              className="text-main hover:underline font-medium"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
