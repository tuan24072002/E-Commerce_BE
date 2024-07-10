const mongoose = require(`mongoose`)

const rateSchema = mongoose.Schema({
    userId: { ref: 'user', type: String },
    productId: String,
    star: Number,
    comment: String,
    purchased: Boolean,
    image: []
}, {
    timestamps: true
})

const rateModel = mongoose.model(`rate`, rateSchema)
module.exports = rateModel