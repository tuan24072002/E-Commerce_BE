const userModel = require("../models/userModel")
const checkRole = async (req, res, next) => {
    try {
        const checkAdmin = await userModel.findById(req.userId)
        if (checkAdmin?.role === 'ADMIN') {
            next()
        } else {
            res.json({
                message: "Only admin can use this function !",
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
module.exports = checkRole