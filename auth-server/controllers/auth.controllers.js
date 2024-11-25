const usersModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const { sendOtp, generateOtp } = require("../utils/otp");
const { createToken } = require("../utils/createToken");

const userRegisteration = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExist = await usersModel.findOne({ email, phone });
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usersModel({
      name,
      email,
      phone,
      password: hashedPassword,
      verified: false,
    });
    await newUser.save();

    const otp = generateOtp();
    const otpValidity = new Date(Date.now() + 10 * 60 * 1000);

    await usersModel.findByIdAndUpdate(newUser._id, {
      otp,
      otpValidity,
    });

    await sendOtp(phone, otp);
    console.log(otp);

    res.status(201).json({
      message: "OTP sent to your phone. Please verify",
      userId: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "Please enter valid details" });
    }

    const user = await usersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (new Date() > new Date(user.otpValidity)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await usersModel.findByIdAndUpdate(userId, {
      verified: true,
      otp: null,
      otpValidity: null,
    });

    const token = createToken({
      userId,
    });

    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      userId: userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during OTP verification" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log(phone);
    const user = await usersModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: " user Not found" });
    }

    const otp = generateOtp();
    const otpValidity = new Date(Date.now() + 10 * 60 * 1000);

    await usersModel.findByIdAndUpdate(user._id, {
      otp,
      otpValidity,
    });
    console.log(otp);
    await sendOtp(phone, otp);
    res.status(200).json({
      message: "OTP sent to your phone. Please verify",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login" });
  }
};

module.exports = {
  userRegisteration,
  otpVerification,
  userLogin,
};
