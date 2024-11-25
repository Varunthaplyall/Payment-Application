const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { PORT, MONGO_URL } = process.env;
const mongoose = require("mongoose");
const walletRoute = require("./route/wallet.route");
const transactionsRoutes = require("./route/transactions.routes");
const corse = require("cors");
const socket = require("./sockets/socket");

app.use(corse());
app.use(express.json());

app.use("/api/v1/wallet", walletRoute);
app.use("/api/v1/transactions", transactionsRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log("Server is up");
    });
  })
  .catch((err) => {
    console.log(err);
  });
