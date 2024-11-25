const { AUTH_SERVER_URL, key_id, key_secret } = process.env;
const socket = require("../sockets/socket");
const Razorpay = require("razorpay");
const userWalletModel = require("../models/userWallet.model");
const transactionModel = require("../models/transaction.model");
const { default: axios } = require("axios");

const moneyTransfer = async (req, res) => {
  let { recipientPhone, amount } = req.body;

  if (!recipientPhone || !amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid input. Provide recipient phone no and a valid amount.",
    });
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
      recipientPhone: recipientPhone,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return res
      .status(500)
      .json({ message: "Error processing transaction", error: error.message });
  }
};

const paymentValidation = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    recipientPhone,
    amount,
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
      const senderId = req.user._id;
      const response = await axios.get(`${AUTH_SERVER_URL}user-details`, {
        params: {
          phone: recipientPhone,
        },
      });

      const recipient = response.data;
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }

      if (senderId === recipient._id) {
        return res
          .status(400)
          .json({ message: "cannot send money to yourself" });
      }

      const senderWallet = await userWalletModel.findOne({ userId: senderId });

      if (!senderWallet || senderWallet.balance < amount) {
        return res.status(404).json({ message: "Insufficient Funds" });
      }

      const recipientWallet = await userWalletModel.findOne({
        userId: recipient._id,
      });

      if (!recipientWallet) {
        return res.status(404).json({ message: "Recipient wallet not found." });
      }

      senderWallet.balance -= amount;
      await senderWallet.save();

      recipientWallet.balance += amount;
      await recipientWallet.save();

      const transaction = new transactionModel({
        senderId,
        recipientId: recipient._id,
        amount,
        timestamp: new Date(),
      });

      await transaction.save();

      socket.emit("paymentNotification", {
        userId: recipient._id,
        message: `You have received ${amount}Rs from ${
          req.user.name
        } on ${new Date()}`,
      });
      return res.status(200).json({
        message: "Transaction successful.",
        newBalance: senderWallet.balance,
        senderId,
        senderName: req.user.name,
        recipientId: recipient._id,
        recipientName: recipient.name,
        amount,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    return res
      .status(500)
      .json({ message: "Error processing transaction", error: error.message });
  }
};

const transactionHistory = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized access" });
  }

  try {
    const transactionDetails = await transactionModel.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    });

    if (!transactionDetails || transactionDetails.length === 0) {
      return res.status(400).json({ message: "No transactions were made" });
    }

    // to hold response
    const userDetailsPromise = transactionDetails.map((transaction) => {
      const senderId = transaction.senderId;
      const recipientId = transaction.recipientId;

      return new Promise((resolve, reject) => {
        socket.emit(
          "fetchUserDetails",
          { senderId, recipientId },
          (response) => {
            if (response && response.success) {
              resolve({
                transaction,
                sender: response.sender,
                recipient: response.recipient,
              });
            } else {
              reject(console.log("Error fetching user details"));
            }
          }
        );
      });
    });

    const newTransactionDetails = await Promise.all(userDetailsPromise);

    const responseData = newTransactionDetails.map((data) => ({
      transaction: data.transaction,
      sender: data.sender,
      recipient: data.recipient,
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching transaction history" });
  }
};

module.exports = {
  moneyTransfer,
  paymentValidation,
  transactionHistory,
};
