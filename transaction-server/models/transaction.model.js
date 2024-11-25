const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true 
    },
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User',
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
})

module.exports = mongoose.model('Transaction', transactionSchema)