const { userRegisteration, otpVerification, userLogin } = require('../controllers/auth.controllers');
const authValidator = require('../middleware/validator');
const router = require('express').Router();


router.post('/register', authValidator,userRegisteration)
router.post('/verify-otp', otpVerification)
router.post('/login', userLogin)


module.exports = router