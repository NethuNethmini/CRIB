import React from "react";
import Sidebar from "../Components/Sidebar/sidebar";
import Header from "../Components/Header/header";
import { Route, Routes } from "react-router-dom";

import Customer from "./Bank/customer";
import CustomerProfile from "./Bank/customerProfile";
import Facilities from "./Bank/Facilities";

function Main(): React.JSX.Element {
  return (
    <div className="flex w-full h-screen bg-main/2 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 ">
          <Routes>
            <Route path="/customers" element={<Customer />} />
            <Route path="/cus-profile" element={<CustomerProfile />} />
            <Route path="/facilities" element={<Facilities />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Main;
