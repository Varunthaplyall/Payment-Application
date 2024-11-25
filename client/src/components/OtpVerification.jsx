import React, { useState } from "react";
import AuthServices from "../services/AuthServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OtpVerification = ({ onClose }) => {
  const [userOtp, setUserOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    console.log(userId);
    if (!userId) {
      toast.error("User ID not found, please try logging in again");
      return;
    }

    const response = await AuthServices.OtpVerification(userOtp, userId);
    console.log(response.data);

    if (response.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      navigate("/dashbord");
      toast.success("OTP verified successfully!");
      onClose();
    } else {
      toast.error(response.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="otp"
          className="block mb-2 text-sm font-medium text-blue-500"
        >
          OTP (6 digits)
        </label>
        <input
          type="text"
          name="otp"
          id="otp"
          className="bg-blue-50 border border-blue-300 text-blue-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter OTP"
          maxLength="6"
          required
          onChange={(e) => setUserOtp(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Submit OTP
      </button>
      <div className="text-center text-sm text-gray-500">
        Need help?{" "}
        <a href="#" className="text-blue-700 hover:underline font-medium">
          Contact Support
        </a>
      </div>
    </form>
  );
};

export default OtpVerification;
