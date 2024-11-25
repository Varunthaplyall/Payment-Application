const axios = require("axios");
const { AUTH_SERVER_URL } = process.env;

const tokenVerification = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }
    const response = await axios.post(
      `${AUTH_SERVER_URL}validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    req.user = response.data.user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = tokenVerification;
