const mongoose = require(`mongoose`)

const cartSchema = mongoose.Schema({
    productId: {
        ref: 'product',
        type: String
    },
    price: Number,
    quantity: Number,
    userId: String,
    state: Boolean
}, {
    timestamps: true
})

const cartModel = mongoose.model(`cart`, cartSchema)
module.exports = cartModel