import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import StudentLogin from "./StudentLogin";
import DisplayStudent from "./DisplayStudent";
import StaffLogin from "./StaffLogin";
import Staff from "./Staff";

function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/student" element={<StudentLogin />} />
        <Route path="/student/:matricNumber" element={<DisplayStudent />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </div>
  );
}

export default Router;
