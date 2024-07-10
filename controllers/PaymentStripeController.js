const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE)
const createPayment = async (req, res) => {
    try {
        const { cart, nameReceive, phoneNumberReceive, address, otherNote } = req.body
        if (!cart) {
            return res.json({
                message: "Don't have any product in cart !",
                success: false,
                error: true,
            })
        }
        const lineItem = cart.map((product) => (
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.productId.productName,
                        images: product.productId.productImage.map(img => {
                            return img.url
                        })
                    },
                    unit_amount: Math.round(product.productId.price * 100 - (product.productId.price * 100 * 10 / 100))
                },
                quantity: product.quantity
            }
        ))
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItem,
            mode: "payment",
            success_url: `http://localhost:3000/payment-success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:3000/payment-failed',
            metadata: {
                nameReceive, phoneNumberReceive, address, otherNote
            }
        })
        return res.json({
            session,
            message: `Create stripe payment successfully !`,
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
const getResultPayment = async (req, res) => {
    try {
        const sessionId = req?.query?.session_id
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.status === 'complete') {
            return res.json({
                session,
                message: `Payment successfully!`,
                success: true,
                error: false,
            })
        } else {
            return res.json({
                message: `Payment failed!`,
                success: true,
                error: false,
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            message: error.message,
            success: false,
            error: true,
        })
    }
}
module.exports = {
    createPayment,
    getResultPayment
}