import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Auth/login";
import Register from "./Auth/register";
import Main from "./Pages/Main";
import Verify from "./Pages/Customer/Verify";
import OTP from "./Pages/Customer/OTP";
import Dashboard from "./Pages/Customer/Dashboard";
import Report from "./Pages/Customer/Report";
import Landing from "./Pages/landing";
import Dashboard2 from "../src/Pages/Bank/Dashboard";

function App() {
  return (
    <div className="flex flex-col w-full  bg-main/2">
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/BankDashboard" element={<Dashboard2 />} />

        {/* App routes */}
        <Route path="/main/*" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
