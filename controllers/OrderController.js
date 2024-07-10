const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const createNewOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { name, phoneNumber, address, note, paymentMethod, paymentState, state } = req.body
        const isCartAvailable = await cartModel.find({ userId })
        if (isCartAvailable.length === 0) {
            return res.json({
                message: "Don't have any cart !",
                success: false,
                error: true,
            })
        }
        let product = []
        isCartAvailable.forEach(item => {
            product.push({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity
            })
        });
        const total = isCartAvailable.reduce((acc, item) => {
            return acc + (item.price * item.quantity - item.price * item.quantity * 10 / 100)
        }, 0)

        const payload = {
            product,
            total,
            userId,
            name,
            phoneNumber,
            address,
            note,
            payment: {
                method: paymentMethod,
                state: paymentState
            },
            state
        }
        const createOrder = new orderModel(payload)
        const saveOrder = await createOrder.save()


        const deleteCart = await cartModel.deleteMany({ userId })
        if (saveOrder) {
            res.json({
                data: saveOrder,
                success: true,
                error: false,
                message: "Create new order successfully !"
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
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const orderById = await orderModel.findById({ _id: orderId }).populate(`product.productId`)
        if (orderById) {
            res.json({
                data: orderById,
                success: true,
                error: false,
                message: "Get order by id !"
            })
        } else {
            res.json({
                message: "Don't have any order by this id !",
                success: false,
                error: true,
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
const getOrderByUserId = async (req, res) => {
    try {
        const userId = req.userId
        const orderByUserId = await orderModel.find({ userId }).populate(`product.productId`).sort({ createdAt: -1 })
        if (orderByUserId) {
            res.json({
                data: orderByUserId,
                success: true,
                error: false,
                message: "Get order by user id !"
            })
        } else {
            res.json({
                message: "Don't have any order by this user id !",
                success: false,
                error: true,
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
const updateOrderById = async (req, res) => {
    try {
        const { orderId, state, reason } = req.body
        if (orderId) {
            const payloadCanceled = {
                state,
                canceled: {
                    reason,
                    canceledAt: new Date()
                }
            }
            const payloadReturned = {
                state,
                returned: {
                    reason,
                    returnedAt: new Date()
                }
            }
            const orderById = await orderModel.findById({ _id: orderId })
            if (orderById?.state === 'Wait for confirmation') {
                const updateOrder = await orderModel.findByIdAndUpdate({ _id: orderId }, payloadCanceled, { new: true })
                return res.json({
                    data: updateOrder,
                    success: true,
                    error: false,
                    message: "Update order by id !"
                })
            } else if (orderById?.state === 'Completed') {
                const updateOrder = await orderModel.findByIdAndUpdate({ _id: orderId }, payloadReturned, { new: true })
                return res.json({
                    data: updateOrder,
                    success: true,
                    error: false,
                    message: "Update order by id !"
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
    createNewOrder,
    getOrderById,
    getOrderByUserId,
    updateOrderById
}