const transactionModel = require("../models/transaction.model");
const userWalletModel = require("../models/userWallet.model");
const Razorpay = require("razorpay");
const { key_id, key_secret } = process.env;

const walletBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await userWalletModel.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Create your wallet" });
    }
    return res.status(200).json({
      balance: wallet.balance,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error retrieving balance", error: error.message });
  }
};

const updateWalletBalance = async (req, res) => {
  let { amount } = req.body;
  const userId = req.user._id;

  if (!amount || amount < 0) {
    return res.status(400).json({ message: "Please enter valid input" });
  }
  try {
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount format" });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: parseFloat(amount) * 100,
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      message: "Razorpay order created successfully.",
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      userId: userId,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error Occured ", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const {
    amount,
    userId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;

  const {
    validatePaymentVerification,
  } = require("../node_modules/razorpay/dist/utils/razorpay-utils");

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      key_secret
    );
    if (isValid) {
      let userWallet = await userWalletModel.findOne({ userId });

      if (!userWallet) {
        userWallet = new userWalletModel({
          userId: userId,
          balance: amount,
        });
      } else {
        userWallet.balance += amount;
      }
      await userWallet.save();

      const transaction = new transactionModel({
        senderId: userId,
        recipientId: userId,
        amount,
        timestamp: new Date(),
      });

      await transaction.save();

      return res.status(200).json({
        message: "Money added successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error Occured ", error: error.message });
  }
};

module.exports = {
  walletBalance,
  updateWalletBalance,
  verifyPayment,
};
