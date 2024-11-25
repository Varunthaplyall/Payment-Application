const router = require("express").Router();
const {
  walletBalance,
  updateWalletBalance,
  verifyPayment,
} = require("../controllers/wallet.controllers");
const tokenVerification = require("../middleware/tokenVerify");

router.get("/balance", tokenVerification, walletBalance);
router.post("/add-money", tokenVerification, updateWalletBalance);
router.post("/verify", tokenVerification, verifyPayment);

module.exports = router;
