const express = require(`express`)

const router = express.Router()
const authToken = require("../middleware/authToken")
const checkRole = require("../middleware/checkRole")

const {
    userSignUpController,
    userSignInController,
    userLogoutController,
    userDetailController
} = require(`../controllers/AuthController`)

const {
    allUsersController,
    updateUserController,
    deleteUserController,
    uploadProductController,
    updateProductController,
    deleteProductController,
    dashBoardOverview,
    getAllOrder,
    updateStateOrder,
} = require("../controllers/AdminController")

const {
    getAllProductController,
    getCategoryProduct,
    getProductByCategory,
    getProductDetail,
    searchProduct,
    filterProduct,
    getProductByCategoryPaginate
} = require('../controllers/ProductController')

const {
    uploadImageController,
    deleteImageController
} = require(`../controllers/CloundinaryController`)

const {
    addToCart,
    countCartProduct,
    getCartProduct,
    plusOrMinusQuantityProductCart,
    deleteProductCart,
    updateStateProductCart,
    getCartProductStateTrue,
    deleteAllCart
} = require("../controllers/CartController")

const upload = require('../middleware/multer')
const checkBlock = require("../middleware/checkBlock")
const {
    createPayment,
    getResultPayment
} = require("../controllers/PaymentStripeController")
const {
    createNewOrder,
    getOrderById,
    getOrderByUserId,
    updateOrderById
} = require("../controllers/OrderController")
const {
    changeInformation
} = require("../controllers/SettingController")
const {
    createRate,
    getRateByProductId
} = require('../controllers/RateController')
router.get(`/`, (req, res) => {
    res.send(`Welcome to my Backend ^^`)
    // console.log(res.cookie);
    console.log(req.cookies);
    // console.log(req.signedCookies);
})

//Auth
router.post(`/signup`, userSignUpController)
router.post(`/signin`, checkBlock, userSignInController)
router.post(`/logout`, userLogoutController)
router.get(`/user-detail`, authToken, userDetailController)

//Users
router.get(`/all-users`, authToken, allUsersController)
router.put(`/update-user`, authToken, checkRole, updateUserController)
router.delete('/delete-user', authToken, checkRole, deleteUserController)

//Products
router.get(`/all-product`, getAllProductController)
router.get(`/category-product`, getCategoryProduct)
router.get('/getProByCat/:category', getProductByCategory)
router.get(`/getProByCatPaginate/:category`, getProductByCategoryPaginate)
router.get('/product-detail/:productId', getProductDetail)
router.post(`/upload-product`, authToken, checkRole, uploadProductController)
router.put(`/update-product`, authToken, checkRole, updateProductController)
router.delete('/delete-product', authToken, checkRole, deleteProductController)
router.get(`/search-product`, searchProduct)
router.post(`/filter-product`, filterProduct)

//Upload Image Cloundinary
router.post('/upload-image', upload.single(`image`), uploadImageController)
router.delete('/delete-image', deleteImageController)

//Cart
router.post(`/add-to-cart`, authToken, addToCart)
router.put(`/plus-minus-product-cart`, authToken, plusOrMinusQuantityProductCart)
router.get(`/count-cart-product`, authToken, countCartProduct)
router.get(`/get-cart-product`, authToken, getCartProduct)
router.get(`/get-cart-product-state-true`, authToken, getCartProductStateTrue)
router.delete(`/delete-product-cart`, authToken, deleteProductCart)
router.post(`/update-state-product-cart`, authToken, updateStateProductCart)
router.delete(`/delete-cart`, authToken, deleteAllCart)

//Order
router.post('/create-order', authToken, createNewOrder)
router.get(`/get-all-order`, authToken, checkRole, getAllOrder)
router.get(`/get-order-by-id/:orderId`, authToken, getOrderById)
router.post(`/update-state-order`, authToken, checkRole, updateStateOrder)
router.get(`/get-order-by-userId`, authToken, getOrderByUserId)
router.post(`/update-order-by-id`, authToken, updateOrderById)

//Dashboard
router.get(`/dashboard`, authToken, checkRole, dashBoardOverview)

//Setting
router.post(`/change-information`, authToken, changeInformation)

//Stripe payment
router.post('/create-payment-stripe', createPayment)
router.get(`/webhook`, getResultPayment)

//Rate
router.post('/create-rate', authToken, createRate)
router.get(`/get-rate-by-proId/:productId`, getRateByProductId)

module.exports = router