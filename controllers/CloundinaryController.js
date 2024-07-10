const cloundinary = require('../config/CloundinaryConfig')

const uploadImageController = (req, res) => {
    cloundinary.uploader.upload(req.file.path, (err, rs) => {
        if (err) {
            return res.json({
                message: err.message,
                success: false,
                error: true,
            })
        }

        res.json({
            data: rs,
            success: true,
            error: false,
            message: "Upload Image !"
        })
    })
}
const deleteImageController = (req, res) => {
    const { public_id } = req.body
    cloundinary.uploader.destroy(public_id, (err, rs) => {
        if (err) {
            return res.json({
                message: err.message,
                success: false,
                error: true,
            })
        }

        res.json({
            data: rs,
            success: true,
            error: false,
            message: "Delete Image !"
        })
    })
}
module.exports = {
    uploadImageController,
    deleteImageController
}