const userModel = require(`../models/userModel`)
const bcrypt = require('bcryptjs');

const changeInformation = async (req, res) => {
    try {
        const userId = req.userId
        const { name, email, phoneNumber, address, profilePic, oldPass, newPass } = req.body
        const findUser = await userModel.findById({ _id: userId })
        if (oldPass === findUser.password) {
            const updateUser = await userModel.findByIdAndUpdate(userId, { name, email, phoneNumber, address, profilePic }, { new: true })
            if (updateUser) {
                return res.json({
                    data: updateUser,
                    message: `Updated successfully !`,
                    success: true,
                    error: false,
                })
            } else {
                res.json({
                    message: 'User not found !',
                    success: false,
                    error: true,
                })
            }
        } else {
            if (bcrypt.compareSync(oldPass, findUser.password)) {
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hashSync(newPass, salt);
                if (!hashPassword) {
                    throw new Error(`Hash password is wrong !`)
                }
                const updateUser = await userModel.findByIdAndUpdate(userId, { password: hashPassword }, { new: true })
                if (updateUser) {
                    return res.json({
                        data: updateUser,
                        message: `Updated successfully !`,
                        success: true,
                        error: false,
                    })
                } else {
                    res.json({
                        message: 'User not found !',
                        success: false,
                        error: true,
                    })
                }
            } else {
                res.json({
                    message: `Wrong password !`,
                    success: false,
                    error: true,
                })
            }
        }
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true,
        })
    }
}
module.exports = {
    changeInformation,
}