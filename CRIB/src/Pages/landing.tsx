import React, { useEffect } from "react";
import {  Rocket, CheckCircle, Lock, ArrowRight, TrendingUp } from "lucide-react";
import Logo from "../Components/Logo/logo";
import Landingimg from "../assets/Landing7.jpg"
import Lankdingimg2 from "../assets/Landing6.jpg"
import { useNavigate } from "react-router-dom";
import RoleDropdown from "../Components/Dropdown/dropdown";

// AOS-like animation hook (Kept as is for functionality)
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  useScrollAnimation();

  const primaryColor = "text-cyan-500";
  const primaryBg = "bg-cyan-600 hover:bg-cyan-700";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Logo />
              </div>
            </div>

            {/* Right-side Navigation Buttons */}
            <div className="flex items-center space-x-6">
              <RoleDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="text-6xl sm:text-4xl lg:text-7xl font-extrabold bg-gradient-to-r from-gray-700 via-gray-700 to-cyan-600 bg-clip-text text-transparent mb-8 leading-tight tracking-tighter aos-fade-up"
            data-aos="fade-up"
          >
            Your Official Self-Inquiry <br className="hidden sm:inline"/> Credit Report
          </h1>
          <p
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto aos-fade-up"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Access your comprehensive credit history securely and conveniently
            through the official CRIB Customer Access Portal.
          </p>
          <div className="flex items-center justify-center cursor-pointer">
            <button
              className={`group ${primaryBg} text-white font-bold px-10 py-5 rounded-xl text-xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-cyan-400/50 flex items-center justify-center gap-3 cursor-pointer`}
              onClick={() => navigate("/cus-login")}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Apply for MyReport
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
      
      <div className="h-0.5 w-full bg-gradient-to-r from-gray-50 via-cyan-200 to-gray-50"></div>

      {/* Why Get Your CRIB Report Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-10 border border-gray-100 aos-fade-right"
            data-aos="fade-right"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Get Your <span className={primaryColor}>CRIB Report</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Understanding your financial footprint is the first step towards financial freedom. Prepare for major applications and verify your data's accuracy.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Financial Health Check
                </h3>
                <p className="text-gray-600">
                  Get a clear picture of your credit history to make
                  informed financial decisions and plan your future.
                </p>
              </div>

              <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Loan Application Readiness
                </h3>
                <p className="text-gray-600">
                  A strong credit report is essential for unlocking better loan terms and
                  faster approvals from financial institutions.
                </p>
              </div>
            </div>
          </div>

          <div className="h-full">
            <img 
                src={Lankdingimg2} 
                className="w-full h-full object-cover rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                alt="Credit report in hand"
            />
          </div>
        </div>
      </section>

      {/* Quick, Secure, and Digital Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-400/50 aos-fade-right"
              data-aos="fade-right"
            >
              <img
                src={Landingimg}
                alt="Person writing with laptop"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="aos-fade-left" data-aos="fade-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Quick, <span className={primaryColor}>Secure</span>, and Digital
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                Our streamlined online process ensures you get your report
                efficiently, right from your home, while keeping your data absolutely protected.
              </p>

              <div className="space-y-10">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      End-to-End Security
                    </h3>
                    <p className="text-gray-600">
                      Your personal data is protected with the highest security
                      standards and encryption throughout the entire reporting process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Simple Online Verification
                    </h3>
                    <p className="text-gray-600">
                      Verify your identity with our easy-to-follow digital steps, eliminating the need for complex paperwork or branch visits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Minimalist Update) */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Removed the commented-out layout for a cleaner look */}
          {/* <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p className="mb-2">
              © 2024 Credit Information Bureau of Sri Lanka. All Rights
              Reserved.
            </p>
            <p className="text-xs text-gray-500">
                Official CRIB Customer Access Portal
            </p>
          </div> */}
        </div>
      </footer>

      <style>{`
        /* AOS-like styles (Kept as is) */
        [data-aos] {
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        [data-aos="fade-up"] {
          transform: translateY(30px);
        }

        [data-aos="fade-right"] {
          transform: translateX(-30px);
        }

        [data-aos="fade-left"] {
          transform: translateX(30px);
        }

        [data-aos].aos-animate {
          opacity: 1;
          transform: translate(0, 0);
        }

        [data-aos-delay="100"].aos-animate {
          transition-delay: 0.1s;
        }

        [data-aos-delay="200"].aos-animate {
          transition-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Landing;