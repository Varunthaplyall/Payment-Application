import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OtpVerification from "../components/OtpVerification";
import Dashboard from "../pages/Dashbord";
import ViewTransactions from "../pages/ViewTransactions";
import Payment from "../pages/Payment";
import ProtectedRoutes from "../utils/ProtectedRoutes";

const AppRoutes = ({ handleLogin }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/OtpVerification" element={<OtpVerification />} />

        <Route
          path="/dashbord"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/viewTransactions"
          element={
            <ProtectedRoutes>
              <ViewTransactions />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoutes>
              <Payment />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
