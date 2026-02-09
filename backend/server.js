import 'dotenv/config'
import http from 'http'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { setupSocket } from './socket.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import inquiryRoutes from './routes/inquiries.js'
import mandiRoutes from './routes/mandi.js'
import schemeRoutes from './routes/schemes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

connectDB()

const app = express()
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000

setupSocket(httpServer)

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/mandi', mandiRoutes)
app.use('/api/schemes', schemeRoutes)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'AgriMarket API is running.' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Server error.' })
})

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
