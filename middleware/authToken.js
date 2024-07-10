const jwt = require(`jsonwebtoken`)

const authToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.json({
                message: "Please login... !",
                success: false,
                error: true,
            })
        }
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json({
                    message: err.message,
                    success: false,
                    error: true,
                })
            }
            req.userId = decoded?._id
            next()
        })
    } catch (error) {
        res.json({
            message: 'Cookies not found !',
            data: [],
            success: false,
            error: true,
        })
    }
}
module.exports = authToken