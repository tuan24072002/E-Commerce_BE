const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    product: [
        {
            productId: { ref: 'product', type: String },
            price: { type: Number },
            quantity: { type: Number }
        }
    ],
    total: Number,
    userId: String,
    name: String,
    phoneNumber: String,
    address: String,
    note: String,
    payment: {
        method: { type: String },
        state: { type: Boolean }
    },
    state: {
        type: String,
        defaultValue: 'Wait for confirmation'
    },
    canceled: {
        reason: { type: String },
        canceledAt: { type: String }
    },
    returned: {
        reason: { type: String },
        returnedAt: { type: String }
    },
    completedAt: { type: String }
}, {
    timestamps: true
})
const orderModel = mongoose.model(`order`, orderSchema)
module.exports = orderModel