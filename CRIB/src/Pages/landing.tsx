import React, { useEffect } from "react";
import { Shield, Rocket, CheckCircle, Lock, ArrowRight } from "lucide-react";
import Logo from "../Components/Logo/logo";
import Landingimg from "../assets/Landing7.jpg"
import Lankdingimg2 from "../assets/Landing6.jpg"
import { useNavigate } from "react-router-dom";

// AOS-like animation hook
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
  const navigate= useNavigate()
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 rounded-bl-2xl rounded-br-2xl">
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
              <button className="text-white bg-main px-4 py-1 rounded-lg font-medium transition-colors"
              onClick={() => navigate("/login")}
              >
               Bank Portal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-22 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-800  to-[#06b6d4] bg-clip-text text-transparent mb-6 leading-tight aos-fade-up"
            data-aos="fade-up"
          >
            Your Official Self-Inquiry Credit Report from CRIB
          </h1>
          <p
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto aos-fade-up"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Access your comprehensive credit history securely and conveniently
            through the official CRIB Customer Access Portal.
          </p>
          <div className="flex items-center justify-center cursor-pointer mt-4">
            <button
              className="group bg-main  text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
             onClick={() => navigate("/verify")}

              data-aos="fade-up"
              data-aos-delay="200"
            >
              Apply for MyReport
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Get Your CRIB Report Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 aos-fade-right"
            data-aos="fade-right"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Get Your CRIB Report?
            </h2>
            <p className="text-gray-600 mb-8">
              Understand your financial standing, prepare for loan applications,
              and ensure the accuracy of your credit data.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Financial Health Check
                </h3>
                <p className="text-gray-600">
                  Get a clear picture of your credit history and score to make
                  informed financial decisions.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Loan Application Readiness
                </h3>
                <p className="text-gray-600">
                  A good credit report is key to unlocking better loan terms and
                  faster approvals.
                </p>
              </div>
            </div>
          </div>

          <div>
            <img src={Lankdingimg2} className="w-full h-full object-cover rounded-2xl"/>
          </div>
        </div>
      </section>

      {/* Quick, Secure, and Digital Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl aos-fade-right"
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
                Quick, Secure, and Digital
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                Our streamlined online process ensures you get your report
                efficiently while keeping your data protected.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Secure and Confidential
                    </h3>
                    <p className="text-gray-600">
                      Your personal data is protected with the highest security
                      standards throughout the process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Simple Online Verification
                    </h3>
                    <p className="text-gray-600">
                      Verify your identity from the comfort of your home with
                      our easy-to-follow digital steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            {/* <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded flex items-center justify-center text-white font-bold">
                  CB
                </div>
              </div>
              <p className="text-sm mb-2">
                Credit Information Bureau of Sri Lanka
              </p>
              <p className="text-sm mb-2">
                No. 12, Sir Baron Jayathilaka Mawatha, Colombo 01.
              </p>
              <p className="text-sm">+94 11 213 1313</p>
            </div> */}

            <div>
              {/* <h3 className="font-semibold text-white mb-4">QUICK LINKS</h3> */}
              <ul className="space-y-2">
                {/* <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About CRIB
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li> */}
              </ul>
            </div>

            <div>
              {/* <h3 className="font-semibold text-white mb-4">LEGAL</h3> */}
              <ul className="space-y-2">
                {/* <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            {/* <p>
              © 2024 Credit Information Bureau of Sri Lanka. All Rights
              Reserved.
            </p> */}
          </div>
        </div>
      </footer>

      <style>{`
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
