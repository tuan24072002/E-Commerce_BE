const orderModel = require('../models/orderModel')
const rateModel = require('../models/rateModel')
const createRate = async (req, res) => {
    try {
        const userId = req.userId
        const { productId, star, comment, image } = req.body

        let purchased = false;
        const isPurchased = await orderModel.find({ userId, 'product.productId': productId, state: 'Completed' })
        if (isPurchased.length > 0) {
            purchased = true;
        }
        const payload = { userId, productId, star, comment, image, purchased }

        const createRate = new rateModel(payload)
        const saveRate = await createRate.save()
        if (saveRate) {
            res.json({
                data: saveRate,
                success: true,
                error: false,
                message: "Uploaded rate successfully !"
            })
        }
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true,
        })
    }
}
const getRateByProductId = async (req, res) => {
    try {
        const { productId } = req.params
        const getRate = await rateModel.find({ productId }).populate(`userId`).sort({ createdAt: -1 })
        if (getRate) {
            res.json({
                data: getRate,
                success: true,
                error: false,
                message: "Get rate by proId successfully !"
            })
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
    createRate,
    getRateByProductId
}