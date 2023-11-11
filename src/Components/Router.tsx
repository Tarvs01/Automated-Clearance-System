import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import StudentLogin from "./StudentLogin";
import DisplayStudent from "./DisplayStudent";
import StaffLogin from "./StaffLogin";
import Staff from "./Staff";
import AdminLogin from "./AdminLogin";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Router() {
  return (
    <div className="router-cont">
      <Navbar />
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student/:matricNumber" element={<DisplayStudent />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default Router;
