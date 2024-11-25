const usersModel = require("../models/users.model");
const { sendNotification } = require("../utils/otp");

const connectedUsers = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("client-server", ({ userId }) => {
      connectedUsers[userId] = socket.id;
      console.log("Befior", connectedUsers);
    });

    socket.on(
      "fetchUserDetails",
      async ({ senderId, recipientId }, callback) => {
        const sender = await usersModel.findById(senderId).select("name");
        const recipient = await usersModel.findById(recipientId).select("name");

        callback({ success: true, sender: sender, recipient: recipient });
      }
    );

    socket.on("paymentNotification", async (data) => {
      const userData = connectedUsers[data.userId];
      console.log(userData);
      if (userData) {
        const recipientId = data.userId;
        const user = await usersModel.findById(recipientId).select("phone");

        const message = data.message;
        const phoneNumber = `+${user.phone}`;
        sendNotification(phoneNumber, message);

        io.to(userData).emit("receivedNotification", { data, user });
      } else {
        console.log("user not connected");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const userId = Object.keys(connectedUsers).find(
        (keys) => connectedUsers[keys] == socket.id
      );

      if (userId) {
        delete connectedUsers[userId];
        console.log("after", connectedUsers);
      }
    });
  });
};
console.log(connectedUsers);
