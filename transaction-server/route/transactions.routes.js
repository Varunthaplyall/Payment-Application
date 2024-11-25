const {
  moneyTransfer,
  paymentValidation,
  transactionHistory,
} = require("../controllers/transaction.controllers");
const tokenVerification = require("../middleware/tokenVerify");
const router = require("express").Router();

router.post("/Send", tokenVerification, moneyTransfer);
router.post("/verify-payment", tokenVerification, paymentValidation);
router.get("/history", tokenVerification, transactionHistory);

module.exports = router;
