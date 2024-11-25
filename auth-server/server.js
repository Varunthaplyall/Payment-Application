const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const { PORT, MONGO_URL, TRANSACTION_SERVER_URL, CLIENT_SERVER_URL } =
  process.env;
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const cors = require("cors");
const socketHandler = require("./sockets");
const corsOption = {
  origin: [TRANSACTION_SERVER_URL, CLIENT_SERVER_URL],
};

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    cors: {
      origin: "*",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

socketHandler(io);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database Connected");
    server.listen(PORT, () => {
      console.log(`Server is up`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
