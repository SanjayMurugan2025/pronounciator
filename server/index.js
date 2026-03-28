import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

dotenv.config()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pronuncia-pet', {
    serverSelectionTimeoutMS: 2000
  })
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.error('MongoDB connection error (starting server anyway):', error.message)
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  })
