import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";

// Layouts
import PublicLayout from "./layouts/userLayout";
import BankLayout from "./layouts/bankLayout";
import CribLayout from "./layouts/cribLayout";

// Public Pages
import LoginBank from "./Auth/login";
import Landing from "./Pages/landing";

// Role-based route groups
import { bankRoutes } from "./routes/bankRoutes";
import { cribRoutes } from "./routes/cribRoutes";

// Auth Pages
import CRIBLogin from "./Auth/crib-login";
import CRIBRegister from "./Auth/crib-register";
import Verify from "./Pages/Customer/Verify";
import CustomerLogin from "./Pages/Customer/cus-login";
import Register from "./Auth/register";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Pages/Bank/Dashboard";

function App() {
  return (
    <div className="app-container">
      {/* Global Toaster */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: { background: "#000", color: "#fff" },
          success: { duration: 3000, iconTheme: { primary: "green", secondary: "black" } },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/bank-login" element={<LoginBank />} />
          <Route path="/bank-register" element={<Register />} />
          <Route path="/crib-login" element={<CRIBLogin />} />
          <Route path="/crib-register" element={<CRIBRegister />} />
          <Route path="/cus-login" element={<CustomerLogin />} />
          <Route path="/cus-register" element={<Verify />} />
          
        </Route>

        {/* Bank Layout Routes */}
        <Route
          element={
            <ProtectedRoute allowed={["bank"]}>
              <BankLayout />
            </ProtectedRoute>
          }
        >
          {bankRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Bank (Outside Layout) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowed={["bank"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/*CRIB Layout Routes */}
        <Route
          element={
            <ProtectedRoute allowed={["crib"]}>
              <CribLayout />
            </ProtectedRoute>
          }
        >
          {cribRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
