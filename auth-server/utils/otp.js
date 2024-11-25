const twilio = require("twilio");
require("dotenv").config({ path: "../.env" });
const { Account_SID, Auth_Token, your_twilio_phone_number } = process.env;
const client = twilio(Account_SID, Auth_Token);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function sendOtp(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your one time otp is : ${otp}. This is only valid for 10 min`,
      from: your_twilio_phone_number,
      to: phoneNumber,
    });
    console.log("Message sent:", message.sid);

    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
}

async function sendNotification(phoneNumber, message) {
  try {
    const newMessage = await client.messages.create({
      body: `${message}`,
      from: your_twilio_phone_number,
      to: phoneNumber,
    });
    console.log("Message sent:", newMessage.sid);
  } catch (error) {
    console.error("Error sending Mesaage:", error);
  }
}

module.exports = {
  sendOtp,
  generateOtp,
  sendNotification,
};
