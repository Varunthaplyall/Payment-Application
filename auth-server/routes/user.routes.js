const { tokenValidation } = require("../middleware/tokenValid");
const usersModel = require("../models/users.model");
const router = require("express").Router();

router.post("/validate", tokenValidation, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await usersModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "something went wrong while validating user",
    });
  }
});

router.get("/user-details", async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ message: "Phone no is required." });
  }

  try {
    const user = await usersModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
