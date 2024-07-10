const userModel = require("../models/userModel")
const checkBlock = async (req, res, next) => {
    try {
        const checkBlock = await userModel.findOne({ email: req.body.email })
        if (!checkBlock?.block) {
            next()
        } else {
            res.json({
                message: "Your account has been blocked, please contact the administrator to resolve the problem !",
                success: false,
                error: true,
            })
        }

    } catch (error) {
        res.json({
            message: error.message,
            data: [],
            success: false,
            error: true,
        })
    }
}
module.exports = checkBlock