import React, { useState } from "react";
import TransactionServices from "../services/TransactionServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    recipientPhone: "",
    amount: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "recipientPhone") {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: `91${value}`,
      }));
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token revoked. Please Login again");
    }

    try {
      const response = await TransactionServices.makePayment(
        paymentDetails,
        token
      );
      if (response.success) {
        const { orderId, amount, recipientPhone } = response.data;

        const options = {
          key: `${import.meta.env.VITE_KEY_ID}`,
          amount: amount * 100,
          currency: "INR",
          name: "Myapp Corp",
          description: "Test Transaction",
          order_id: orderId,
          handler: async (paymentResponse) => {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = paymentResponse;

            try {
              const response = await TransactionServices.verifyPayment(
                {
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  recipientPhone,
                  amount,
                },
                token
              );
              if (response.success) {
                toast.success("transaction completed!");
                navigate("/dashbord");
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (error) {
              console.error("Verification error:", error);
              toast.error("Error verifying payment.");
            }
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
        toast.error("Token Expired.Please Login Again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-200 to-blue-100 min-h-[92vh] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Make a Payment
        </h1>

        <p className="text-center text-gray-600 text-lg mb-6">
          Send money to anyone instantly by entering their recipientPhone
          number.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between space-x-6">
            <div className="flex-1">
              <label
                htmlFor="recipientPhone"
                className="block mb-2 text-sm font-medium text-blue-600"
              >
                Recipient's phone Number
              </label>
              <div className="flex items-center border-2 border-blue-300 rounded-lg px-3 py-2">
                <span className="text-blue-600 text-lg">+91</span>
                <input
                  type="tel"
                  id="recipientPhone"
                  name="recipientPhone"
                  className="w-full bg-transparent text-gray-700 pl-2 outline-none"
                  placeholder="Enter recipient's phone number"
                  required
                  // value={paymentDetails.recipientPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-medium text-blue-600"
              >
                Amount
              </label>
              <div className="flex items-center border-2 border-blue-300 rounded-lg px-3 py-2">
                <span className="text-blue-600 text-lg">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="w-full bg-transparent text-gray-700 pl-2 outline-none"
                  placeholder="Amount to send"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg mt-6 transition-colors duration-300"
          >
            Make Payment
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>
            By making a payment, you agree to our{" "}
            <a href="#" className="text-blue-700 hover:underline">
              Terms and Conditions
            </a>
          </p>
          <p>
            Need help?{" "}
            <a href="#" className="text-blue-700 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Payment;
