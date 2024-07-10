const userModel = require(`../models/userModel`)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSignUpController = async (req, res) => {
    setTimeout(async () => {
        try {
            //validate
            const { email, password, name, phoneNumber } = req.body

            const user = await userModel.findOne({ email })
            if (user) {
                throw new Error(`User already exists !`)
            }

            if (!email) {
                throw new Error(`Invalid email !`)
            }
            if (!password) {
                throw new Error(`Invalid password !`)
            }
            if (!name) {
                throw new Error(`Invalid name !`)
            }
            if (!phoneNumber) {
                throw new Error(`Invalid phone number !`)
            }
            //save db
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hashSync(password, salt);
            if (!hashPassword) {
                throw new Error(`Hash password is wrong !`)
            }
            const payload = {
                ...req.body,
                address: '',
                role: name === 'Admin' ? "ADMIN" : "USER",
                block: false,
                password: hashPassword
            }
            const userData = new userModel(payload)
            const saveUser = await userData.save()
            res.json({
                data: saveUser,
                success: true,
                error: false,
                message: "User created successfully !"
            })
        } catch (error) {
            res.json({
                message: error.message,
                success: false,
                error: true,
            })
        }
    }, 3000)
}

const userSignInController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            throw new Error(`Invalid email !`)
        }
        if (!password) {
            throw new Error(`Invalid password !`)
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            throw new Error(`User not found !`)
        }
        if (bcrypt.compareSync(password, user.password)) {
            const tokenData = {
                _id: user._id,
                email: user.email
            }
            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 24 });
            const tokenOption = {
                httpOnly: true,
                secure: true
            }
            res.cookie("token", token, tokenOption).json({
                data: token,
                success: true,
                error: false,
                message: "Login successfully !"
            })
        } else {
            res.json({
                message: `Wrong password !`,
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

const userLogoutController = async (req, res) => {
    try {
        res.clearCookie("token")
        res.json({
            message: "Logout successfully !",
            success: true,
            error: false,
            data: []
        })
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true,
        })
    }
}

//get data user by id
const userDetailController = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        if (user) {
            return res.json({
                token: req.cookies,
                data: user,
                success: true,
                error: false,
                message: "User detail !"
            })
        } else {
            return res.json({
                message: "Can't load user detail !",
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
module.exports = {
    userSignInController,
    userSignUpController,
    userLogoutController,
    userDetailController
}