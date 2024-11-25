import React, { useState, useEffect } from "react";
import TransactionServices from "../services/TransactionServices";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token revoked. Please Login again");
    }
    const response = await TransactionServices.fetchTransactionHistory(token);

    if (response.success) {
      const sortedTransactions = response.data.sort(
        (a, b) =>
          new Date(b.transaction.timestamp) - new Date(a.transaction.timestamp)
      );
      setTransactions(sortedTransactions);
    } else {
      toast.error(response.error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <section className=" py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Transaction History
        </h1>
        <h2>
          <Link to="/dashbord" className=" hover: underline">
            {" "}
            Go back
          </Link>
        </h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-6 text-left">Transaction ID</th>
                <th className="py-3 px-6 text-left">Sender</th>
                <th className="py-3 px-6 text-left">Recipient</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-600">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.transaction._id} className="border-t">
                    <td className="py-3 px-6">{transaction.transaction._id}</td>
                    <td className="py-3 px-6">{transaction.sender.name}</td>
                    <td className="py-3 px-6">{transaction.recipient.name}</td>
                    <td className="py-3 px-6 text-blue-600">
                      ${transaction.transaction.amount}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(
                        transaction.transaction.timestamp
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ViewTransactions;
