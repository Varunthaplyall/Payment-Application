const userRegistrationSchema = require("../validate/authValidation");



const authValidator = (req,res,next)=>{
    const body = req.body;
    const {error, value} = userRegistrationSchema.validate(body);

    if (error) {
        const errorMessages = error.details.map(err => err.message); 
        return res.status(400).json({
          message: errorMessages,
        });
      }

      next()
} ;

module.exports = authValidator