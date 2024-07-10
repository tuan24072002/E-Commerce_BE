const userModel = require(`../models/userModel`)
const productModel = require(`../models/productModel`)
const orderModel = require("../models/orderModel")
//Users
const allUsersController = async (req, res) => {
    try {
        const allUsers = await userModel.find()
        if (allUsers) {
            res.json({
                data: allUsers,
                message: "All users",
                success: true,
                error: false,
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
const deleteUserController = async (req, res) => {
    try {
        const { _id } = req.body
        const deleteUser = await userModel.deleteOne(_id)
        if (deleteUser) {
            return res.json({
                message: `Deleted successfully !`,
                success: true,
                error: false,
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

const updateUserController = async (req, res) => {
    try {
        const { _id, name, email, password, role, profilePic, block } = req.body
        const payload = {
            name, email, password, role, profilePic, block
        }
        const updateUser = await userModel.findByIdAndUpdate(_id, payload, { new: true })
        if (updateUser) {
            return res.json({
                data: updateUser,
                message: `Updated successfully !`,
                success: true,
                error: false,
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

//Products
const uploadProductController = async (req, res) => {
    try {
        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()
        if (saveProduct) {
            res.json({
                data: saveProduct,
                success: true,
                error: false,
                message: "Uploaded product successfully !"
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
const updateProductController = async (req, res) => {
    try {
        const { _id, productName, brandName, category, productImage, description, price, sellingPrice } = req.body
        const payload = {
            productName, brandName, category, productImage, description, price, sellingPrice
        }
        const updateProduct = await productModel.findByIdAndUpdate(_id, payload, { new: true })
        if (updateProduct) {
            res.json({
                data: updateProduct,
                success: true,
                error: false,
                message: "Uploaded product successfully !"
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
const deleteProductController = async (req, res) => {
    try {
        const { _id } = req.body

        const deleteProduct = await productModel.deleteOne(_id)
        if (deleteProduct) {
            return res.json({
                message: `Deleted successfully !`,
                success: true,
                error: false,
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
const dashBoardOverview = async (req, res) => {
    try {
        const countAdmin = await userModel.find({ role: 'ADMIN' }).countDocuments()
        const countUser = await userModel.find({ role: 'USER' }).countDocuments()
        const countProduct = await productModel.find().countDocuments()
        const countOrderComplete = await orderModel.find({ state: 'Completed' }).countDocuments()
        const countOrderCancel = await orderModel.find({ state: 'Canceled' }).countDocuments()

        const orderComplete = await orderModel.find({ state: 'Completed' })
        let totalRevenue = 0
        orderComplete.forEach(item => {
            totalRevenue += item.total
        });
        return res.json({
            data: [
                { name: 'Admin', value: countAdmin },
                { name: 'User', value: countUser },
                { name: 'Product', value: countProduct },
                { name: 'Order complete', value: countOrderComplete },
                { name: 'Order cancel', value: countOrderCancel },
                { name: 'Revenue', value: totalRevenue },
            ],
            message: `Dashboard overview !`,
            success: true,
            error: false,
        })

    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true,
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const allOrders = await orderModel.find()
        if (allOrders) {
            res.json({
                data: allOrders,
                message: "All orders",
                success: true,
                error: false,
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
const updateStateOrder = async (req, res) => {
    try {
        const { state, orderId } = req.body
        const payload = { state, completedAt: new Date() }
        const updateOrder = await orderModel.findByIdAndUpdate({ _id: orderId }, payload, { new: true })
        if (updateOrder) {
            res.json({
                data: updateOrder,
                success: true,
                error: false,
                message: "Update state order successfully !"
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
    allUsersController,
    deleteUserController,
    updateUserController,
    uploadProductController,
    updateProductController,
    deleteProductController,
    dashBoardOverview,
    getAllOrder,
    updateStateOrder
}