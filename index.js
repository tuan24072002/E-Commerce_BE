const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require(`dotenv`).config()
const connectDB = require(`./config/db`)
const router = require(`./routes/index`)
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '100mb' }))
app.use(`/api`, router)
app.use('/api/province', createProxyMiddleware({
    target: 'https://vapi.vnappmob.com/api/province',
    changeOrigin: true,
    onProxyReq: function (proxyReq, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'; // Correct origin
    },
}))
const PORT = 8080 || process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Connect to Mongo DB`);
        console.log(`Server is running at: 
http://localhost:${PORT}/api/`);
    })
})
