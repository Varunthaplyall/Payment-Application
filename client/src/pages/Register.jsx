import React, { useState } from "react";
import AuthServices from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import OtpVerification from "../components/OtpVerification";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setUserDetails((prev) => ({
        ...prev,
        [name]: `91${value}`,
      }));
    } else {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const register = await AuthServices.Signup(userDetails);
    if (register.success) {
      localStorage.setItem("userId", register.data.userId);
      setIsModalOpen(true);
      // navigate("/OtpVerification");
      toast("Please Enter your otp!", {
        icon: "👏",
      });
    } else {
      toast.error(register.error);
    }
  };

  return (
    <section className="bg-light-blue-100 min-h-[80vh] flex items-center justify-center pt-16">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 space-y-4 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-black sm:text-2xl">
            Create an Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-black"
              >
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-blue-50 border border-blue-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="John Doe"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-black"
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-blue-50 border border-blue-300 text-blue-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@company.com"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-black"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="bg-blue-50 border border-blue-300 text-blue-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="+123 456 7890"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-blue-50 border border-blue-300 text-blue-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-black rounded bg-blue-50 focus:ring-3 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-black">
                  I accept the{" "}
                  <a
                    className="font-medium text-blue-700 hover:underline"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create an Account
            </button>

            <p className="text-sm font-light text-black">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-700 hover:underline"
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <OtpVerification onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
};

export default Register;
