const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true,
    },
    phone : {
        type : String,
        required : true,
        unique: true,
    },
    password : {
        type : String,
        required : true,
    },
    verified : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : String
    },
    otpValidity : {
        type : Date, 
    }
    
}, {
    timestamps : true
});

module.exports = mongoose.model('User', userSchema)