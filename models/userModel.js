const mongoose = require(`mongoose`)

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: String,
    address: String,
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    role: String,
    block: {
        type: Boolean,
        defaultValue: false
    }
}, {
    timestamps: true
})

const userModel = mongoose.model(`user`, userSchema)
module.exports = userModel