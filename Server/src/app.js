import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import tailorRoutes from './routes/tailorRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import clothRoutes from './routes/clothRoutes.js'

dotenv.config()

const app = express()

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5176'],
        credentials: true,
    }),
)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use('/api/auth', authRoutes)
app.use('/api/tailors', tailorRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/cloths', clothRoutes)

export default app