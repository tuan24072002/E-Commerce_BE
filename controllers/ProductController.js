const productModel = require(`../models/productModel`)
const PAGE_SIZE = 8
const getAllProductController = async (req, res) => {
    try {
        const getAllPro = await productModel.find().sort({ createdAt: -1 })
        if (getAllPro) {
            return res.json({
                data: getAllPro,
                message: `Get all product !`,
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

const getCategoryProduct = async (req, res) => {
    try {
        const getCategoryPro = await productModel.distinct('category')
        if (getCategoryPro) {
            const productByCategory = []

            for (const category of getCategoryPro) {
                const product = await productModel.findOne({ category })
                productByCategory.push(product)
            }

            return res.json({
                data: productByCategory,
                message: `Get category product !`,
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
const getProductByCategoryPaginate = async (req, res) => {
    try {
        const { category } = req?.params
        const page = req?.query?.page || 1
        const skip = (page - 1) * PAGE_SIZE
        const totalProduct = await productModel.find({ category }).countDocuments()
        const totalPage = Math.ceil(totalProduct / PAGE_SIZE)
        if (page) {
            const aggregation = [
                { $match: { category } },
                { $skip: skip },
                { $limit: PAGE_SIZE }
            ];
            const proByCatIdPaginate = await productModel.aggregate(aggregation)
            if (proByCatIdPaginate) {
                return res.json({
                    data: proByCatIdPaginate,
                    message: `Get product by category paginate !`,
                    pagination: {
                        currentPage: page,
                        totalPage,
                        totalProduct
                    },
                    success: true,
                    error: false,
                })
            }
        } else {
            return res.json({
                message: `Don't have a page !`,
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
const getProductByCategory = async (req, res) => {
    try {
        const { category } = req?.params
        const proByCatId = await productModel.find({ category })
        if (proByCatId) {
            return res.json({
                data: proByCatId,
                message: `Get product by category !`,
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

const getProductDetail = async (req, res) => {
    try {
        const { productId } = req?.params
        const proDetail = await productModel.findById(productId)
        if (proDetail) {
            return res.json({
                data: proDetail,
                message: `Get product detail !`,
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


const searchProduct = (req, res) => {
    setTimeout(async () => {
        try {
            const query = req?.query?.rs
            const page = req?.query?.page
            const skip = (page - 1) * PAGE_SIZE


            const regexp = new RegExp(query, 'i', 'g')
            const totalProduct = await productModel.find({
                '$or': [
                    {
                        productName: regexp
                    },
                    {
                        category: regexp
                    }
                ]
            }).countDocuments()
            const totalPage = Math.ceil(totalProduct / PAGE_SIZE)
            const aggregation = [
                {
                    $match: {
                        "$or": [
                            {
                                productName: regexp
                            },
                            {
                                category: regexp
                            }
                        ]
                    }
                },
                { $skip: skip },
                { $limit: PAGE_SIZE },
            ];
            // if (!query) {
            //     const totalProduct = await productModel.find().countDocuments()
            //     const totalPage = Math.ceil(totalProduct / PAGE_SIZE)
            //     const aggregation = [
            //         { $skip: skip },
            //         { $limit: PAGE_SIZE },
            //     ];
            //     const allProduct = await productModel.aggregate(aggregation)
            //     return res.json({
            //         data: allProduct,
            //         message: `Search product !`,
            //         pagination: {
            //             currentPage: page,
            //             totalPage,
            //             totalProduct
            //         },
            //         success: true,
            //         error: false,
            //     })
            // }

            const search = await productModel.aggregate(aggregation)

            return res.json({
                data: search,
                message: `Search product !`,
                pagination: {
                    currentPage: page,
                    totalPage,
                    totalProduct
                },
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
    }, 1000)
}
const filterProduct = (req, res) => {
    setTimeout(async () => {
        try {
            const { category, state } = req.body
            const page = req?.query?.page
            const skip = (page - 1) * PAGE_SIZE
            const totalProduct = await productModel.find({ category }).countDocuments()
            const totalPage = Math.ceil(totalProduct / PAGE_SIZE)
            if (category) {
                const aggregation = [
                    { $match: { category: { $in: category } } },
                    { $skip: skip },
                    { $limit: PAGE_SIZE },
                ];
                if (state) {
                    aggregation.push({ $sort: state === 'ASC' ? { sellingPrice: 1 } : (state === 'DESC' ? { sellingPrice: -1 } : {}) },)
                }
                const productFilterCategory = await productModel.aggregate(aggregation)
                return res.json({
                    data: productFilterCategory,
                    pagination: {
                        currentPage: page,
                        totalPage,
                        totalProduct
                    },
                    message: `Filter category  product !`,
                    success: true,
                    error: false,
                })
            } else {
                res.json({
                    message: `Don't have any category !`,
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
    }, 500)
}
module.exports = {
    getAllProductController,
    getCategoryProduct,
    getProductByCategory,
    getProductDetail,
    searchProduct,
    filterProduct,
    getProductByCategoryPaginate
}