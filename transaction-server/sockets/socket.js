const dotenv = require("dotenv").config;
const { AUTH_SERVER_URL_2 } = process.env;
const { io } = require("socket.io-client");
const socket = io(AUTH_SERVER_URL_2);

socket.on("connect", () => {
  console.log("connected to auth server");
});

socket.on("disconnect", () => {});

module.exports = socket;
