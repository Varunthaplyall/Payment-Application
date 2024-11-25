import React, { useEffect, useState } from "react";
import TransactionServices from "../services/TransactionServices";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { Wallet, Clock, CreditCard, RefreshCw } from "lucide-react";
import io from "socket.io-client";
const socket = io(`${import.meta.env.VITE_AUTH_URL}`);

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ balance: 0 });
  const [transaction, setTransaction] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [newUser, setNewUser] = useState(false);

  async function fetchBalance() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized");
      return;
    }
    const response = await TransactionServices.fetchBalance(token);
    if (response.success) {
      setBalance((prevBalance) => ({
        ...prevBalance,
        balance: response.data.balance,
      }));
    } else {
      if (response.message === "create Wallet") {
        setNewUser(true);
      } else if (response.error === "Invalid or expired token") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      }
      toast.error("Failed to fetch balance");
    }
  }

  async function fetchHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized");
      return;
    }
    const response = await TransactionServices.fetchTransactionHistory(token);
    if (response.success) {
      const sortedTransactions = response.data
        .sort(
          (a, b) =>
            new Date(b.transaction.timestamp) -
            new Date(a.transaction.timestamp)
        )
        .slice(0, 3);
      setTransaction(sortedTransactions);
    } else {
      if (response.error) {
        toast.error(`${response.error}`);
      }
    }
  }

  const handleAddMoney = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized");
      return;
    }

    const isNumber = parseFloat(amount);
    if (isNaN(isNumber) || isNumber <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const response = await TransactionServices.addMoney(isNumber, token);

    if (response.success) {
      const { amount, orderId, userId } = response.data;

      const options = {
        key: `${import.meta.env.VITE_KEY_ID}`,
        amount: amount * 100,
        currency: "INR",
        name: "Myapp Corp",
        description: "Test Transaction",
        order_id: orderId,
        handler: async (paymentResponse) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            paymentResponse;

          try {
            const response = await TransactionServices.verifyAddMoney(
              {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                userId,
                amount,
              },
              token
            );
            if (response.success) {
              toast.success(`${amount} added to your wallet!`);
              console.log(response);
              setBalance((prevBalance) => ({
                ...prevBalance,
                balance: prevBalance.balance + isNumber,
              }));
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

      console.log(response);
      setAmount("");
      setIsModalOpen(false);
      setNewUser(false);
    } else {
      toast.error(response.error || "Failed to add money");
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to auth server");
      const userId = localStorage.getItem("userId");
      socket.emit("client-server", { userId });
    });

    socket.on("receivedNotification", (data) => {
      const user = localStorage.getItem("userId");
      if (user == data.data.userId) {
        toast(`${data.data.message}`, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("receivedNotification");
      socket.off("client-server");
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-blue-800 drop-shadow-md">
            Your Financial Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Smart money management at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-100 transition hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Wallet className="mr-2 text-blue-600" />
                Current Balance
              </h2>
              <RefreshCw
                onClick={() => {
                  fetchBalance();
                  fetchHistory();
                }}
                className="text-gray-500 hover:text-blue-600 cursor-pointer"
              />
            </div>
            {!newUser ? (
              <p className="text-3xl font-bold text-blue-700 animate-pulse">
                ₹
                {balance.balance != null
                  ? balance.balance.toLocaleString()
                  : "0"}
              </p>
            ) : (
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-green-800 font-semibold mb-2 animate-bounce">
                  Create Your Wallet
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition animate-pulse"
                >
                  Add Fund To Start
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-100 transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <CreditCard className="mr-2 text-blue-600" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                to="/payment"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                Make a Payment
              </Link>
              <Link
                to="/viewTransactions"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
              >
                View Transactions
              </Link>
              {!newUser && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                >
                  Add Wallet Funds
                </button>
              )}
            </div>
          </div>

          {/* Recent Transactions Card */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-100 transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <Clock className="mr-2 text-blue-600" />
              Recent Transactions
            </h2>
            {transaction.length <= 0 ? (
              <div className="text-gray-500 text-center py-4">
                No recent transactions
              </div>
            ) : (
              <ul className="space-y-3">
                {transaction.map((transaction) => (
                  <li
                    key={transaction.transaction._id}
                    className="bg-blue-50 p-3 rounded-lg flex justify-between items-center hover:bg-blue-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {transaction.sender.name} → {transaction.recipient.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          transaction.transaction.timestamp
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      ${transaction.transaction.amount}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Money"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border rounded-lg mb-4"
          maxLength="6"
          aria-label="Enter amount to add to wallet"
        />
        <button
          onClick={handleAddMoney}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Money To Wallet
        </button>
      </Modal>
    </section>
  );
};
export default Dashboard;
