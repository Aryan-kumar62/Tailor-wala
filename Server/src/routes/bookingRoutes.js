import express from 'express'
import { createBooking, getCustomerBookings, getTailorBookings, getBookingById, updateStatus, saveMeasurements, saveReview, markPaid } from '../controllers/bookingController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

const ensureRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `${role} access only` })
  }
  next()
}

router.post('/', auth, ensureRole('customer'), createBooking)
router.get('/my', auth, ensureRole('customer'), getCustomerBookings)
router.get('/tailor', auth, ensureRole('tailor'), getTailorBookings)
router.get('/:id', auth, getBookingById)
router.patch('/:id/status', auth, ensureRole('tailor'), updateStatus)
router.post('/:id/measurements', auth, ensureRole('tailor'), saveMeasurements)
router.post('/:id/review', auth, ensureRole('customer'), saveReview)
router.post('/:id/mark-paid', auth, ensureRole('customer'), markPaid)

export default router
