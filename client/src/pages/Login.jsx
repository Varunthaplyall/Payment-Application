import React, { useState } from "react";
import AuthServices from "../services/AuthServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import OtpVerification from "../components/OtpVerification";

const Login = ({ handleLogin }) => {
  const [userPhone, setUserPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let input = `91${e.target.value}`;
    setUserPhone(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthServices.Login(userPhone);
      console.log("API Response:", response.data);

      if (response.success) {
        const userId = response.data.userId;
        handleLogin(userId);
        setIsModalOpen(true);
        toast(`${response.data.message}`, {
          icon: "👏",
        });
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <section className="bg-light-blue-100 min-h-[80vh] flex items-center justify-center pt-16">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg">
        <div className="p-6 sm:p-8 space-y-4">
          <h1 className="text-2xl font-bold text-center text-black">
            Login to Your Account
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Enter your mobile number to receive a login link or OTP.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-black"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="bg-blue-50 border border-blue-300 text-blue-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="+91 4045647890"
                required
                maxLength="13"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Continue
            </button>
          </form>
          <div className="text-center text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-blue-700 hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enter otp"
      >
        <OtpVerification onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
};

export default Login;
