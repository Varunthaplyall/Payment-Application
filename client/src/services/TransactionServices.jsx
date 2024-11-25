import axios from "axios";

const fetchBalance = async (token) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_TRANSACTION_URL}api/v1/wallet/balance`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    if (error.response?.data?.message === "Create your wallet") {
      return {
        success: false,
        error: "Failed to fetch balance",
        message: "create Wallet",
      };
    }
    return { success: false, error: error.response?.data?.message };
  }
};

const fetchTransactionHistory = async (token) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_TRANSACTION_URL}api/v1/transactions/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

const makePayment = async (userDetails, token) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_TRANSACTION_URL}api/v1/transactions/send`,
      userDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    if (error.response) {
      return { success: false, data: error.response?.data?.message };
    }
    return { success: false, data: "An unexpected error occurred" };
  }
};

const addMoney = async (amount, token) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_TRANSACTION_URL}api/v1/wallet/add-money`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

const verifyPayment = async (paymentDetails, token) => {
  try {
    const res = await axios.post(
      `${
        import.meta.env.VITE_TRANSACTION_URL
      }api/v1/transactions/verify-payment`,
      paymentDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: res.status === 200, data: res.data };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      data: error.response?.data?.message || "Error verifying payment",
    };
  }
};

const verifyAddMoney = async (paymentDetails, token) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_TRANSACTION_URL}api/v1/wallet/verify`,
      paymentDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: res.status === 200, data: res.data };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      data: error.response?.data?.message || "Error verifying payment",
    };
  }
};

const TransactionServices = {
  fetchBalance,
  fetchTransactionHistory,
  makePayment,
  addMoney,
  verifyPayment,
  verifyAddMoney,
};

export default TransactionServices;
