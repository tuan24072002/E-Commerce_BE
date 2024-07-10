const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const addToCart = async (req, res) => {
    const { state, productId } = req.body
    if (state === 'addToCart') {
        setTimeout(async () => {
            try {
                const userId = req.userId
                const productById = await productModel.findById({ _id: productId })
                const isProductAvailable = await cartModel.findOne({ productId })

                if (isProductAvailable) {
                    const updateCart = await cartModel.updateOne({ productId: productId }, { $set: { quantity: isProductAvailable.quantity + 1 } })
                    const newCart = await cartModel.findOne({ productId })
                    return res.json({
                        data: newCart,
                        message: 'Update cart successfully !',
                        success: true,
                        error: false,
                    })
                }
                const isFirstProductCart = await cartModel.find({ userId })
                const payload = {
                    productId,
                    price: productById.sellingPrice,
                    quantity: 1,
                    userId,
                    state: isFirstProductCart.length > 0 ? false : true
                }

                const newCart = new cartModel(payload)
                const saveCart = await newCart.save()
                return res.json({
                    data: saveCart,
                    message: `Add to cart successfully !`,
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
        }, 2000)
    } else if (state === 'buyNow') {
        try {
            const { productId } = req.body
            const userId = req.userId
            const productById = await productModel.findById({ _id: productId })
            const isProductAvailable = await cartModel.findOne({ productId })

            if (isProductAvailable) {
                const updateCart = await cartModel.updateOne({ productId: productId }, { $set: { quantity: isProductAvailable.quantity + 1 } })
                const newCart = await cartModel.findOne({ productId })
                return res.json({
                    data: newCart,
                    message: 'Update cart successfully !',
                    success: true,
                    error: false,
                })
            }

            const isFirstProductCart = await cartModel.find({ userId })
            const payload = {
                productId,
                price: productById.sellingPrice,
                quantity: 1,
                userId,
                state: isFirstProductCart.length > 0 ? false : true
            }

            const newCart = new cartModel(payload)
            const saveCart = await newCart.save()
            return res.json({
                data: saveCart,
                message: `Buy now successfully !`,
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
}
const deleteProductCart = async (req, res) => {
    try {
        const { productId } = req.body
        const isProductAvailable = await cartModel.findOne({ productId })
        if (!isProductAvailable) {
            return res.json({
                message: "Don't have this product in cart !",
                success: false,
                error: true,
            })
        }
        const deleteProductCart = await cartModel.deleteOne({ productId })
        const newCart = await cartModel.find()
        return res.json({
            data: newCart,
            message: 'Delete product cart successfully !',
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
const plusOrMinusQuantityProductCart = (req, res) => {
    setTimeout(async () => {
        try {
            const { productId, state } = req.body
            const isProductAvailable = await cartModel.findOne({ productId })
            if (!isProductAvailable) {
                return res.json({
                    message: "Don't have this product in cart !",
                    success: false,
                    error: true,
                })
            }
            if (state === 'PLUS') {
                const plus = await cartModel.updateOne({ productId: productId },
                    { $set: { quantity: isProductAvailable.quantity + 1 } })
                const newCart = await cartModel.findOne({ productId })
                return res.json({
                    data: newCart,
                    message: 'Update cart successfully !',
                    success: true,
                    error: false,
                })
            } else if (state === 'MINUS') {
                if (isProductAvailable.quantity - 1 > 0) {
                    const minus = await cartModel.updateOne({ productId: productId },
                        { $set: { quantity: isProductAvailable.quantity - 1 } })
                    const newCart = await cartModel.findOne({ productId })
                    return res.json({
                        data: newCart,
                        message: 'Update cart successfully !',
                        success: true,
                        error: false,
                    })
                } else {
                    const deleteProductCart = await cartModel.deleteOne({ productId })
                    const newCart = await cartModel.find()
                    return res.json({
                        data: newCart,
                        message: 'Delete cart successfully !',
                        success: true,
                        error: false,
                    })
                }
            } else {
                return res.json({
                    message: "Don't have state !",
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
    }, 200)
}

const countCartProduct = async (req, res) => {
    try {
        const userId = req.userId

        const count = await cartModel.countDocuments({
            userId
        })
        return res.json({
            data: { count },
            message: `Count Cart Product !`,
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

const getCartProduct = async (req, res) => {
    try {
        const userId = req.userId

        const allProductCart = await cartModel.find({ userId }).populate(`productId`)
        return res.json({
            data: allProductCart,
            message: `Get Cart Product !`,
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

const getCartProductStateTrue = async (req, res) => {
    try {
        const userId = req.userId

        const allProductCart = await cartModel.find({
            $and: [
                { userId },
                { state: true }
            ]
        }).populate(`productId`)
        return res.json({
            data: allProductCart,
            message: `Get Cart Product !`,
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

const updateStateProductCart = async (req, res) => {
    try {
        const { state, productId, checkAll } = req.body
        const userId = req.userId
        if (checkAll !== undefined) {
            const getAllProductCart = await cartModel.find({ userId })
            getAllProductCart.forEach(async (element) => {
                const update = await cartModel.updateOne({ productId: element.productId },
                    { $set: { state: checkAll } })
            });
            const newCart = await cartModel.findOne({ productId })
            return res.json({
                data: newCart,
                message: `Update all state product cart !`,
                success: true,
                error: false,
            })
        }
        const update = await cartModel.updateOne({ productId: productId },
            { $set: { state: state } })
        const newCart = await cartModel.findOne({ productId })
        return res.json({
            data: newCart,
            message: `Update state product cart !`,
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
const deleteAllCart = async (req, res) => {
    try {
        const userId = req.userId
        const isCartAvailable = await cartModel.findOne({ userId })
        if (!isCartAvailable) {
            return res.json({
                message: "Don't have any cart !",
                success: false,
                error: true,
            })
        }
        const deleteCart = await cartModel.deleteMany({ userId })
        return res.json({
            message: 'Delete cart successfully !',
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
module.exports = {
    addToCart,
    countCartProduct,
    getCartProduct,
    plusOrMinusQuantityProductCart,
    deleteProductCart,
    updateStateProductCart,
    getCartProductStateTrue,
    deleteAllCart
}