import Booking from '../models/Booking.js'
import TailorProfile from '../models/TailorProfile.js'

export const createBooking = async (req, res) => {
  try {
    const { tailorId, serviceType, description, scheduledAt, price } = req.body

    if (!tailorId || !serviceType || !scheduledAt || !price) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const tailorProfile = await TailorProfile.findById(tailorId)
    if (!tailorProfile) {
      return res.status(404).json({ message: 'Tailor not found' })
    }

    const booking = await Booking.create({
      customer: req.user._id,
      tailor: tailorProfile.user,
      tailorProfile: tailorProfile._id,
      serviceType,
      description,
      scheduledAt,
      price,
      status: 'measurement_scheduled',
    })

    res.status(201).json(booking)
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({ path: 'tailorProfile', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    console.error('Customer bookings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getTailorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tailor: req.user._id })
      .populate('customer', 'name city pincode')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    console.error('Tailor bookings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'tailorProfile', populate: { path: 'user', select: 'name' } })
      .populate('customer', 'name email city')
      .populate('tailor', 'name')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    const isCustomer = req.user.role === 'customer' && booking.customer && booking.customer._id.toString() === req.user._id.toString()
    const isTailor = req.user.role === 'tailor' && booking.tailor && booking.tailor._id.toString() === req.user._id.toString()
    if (!isCustomer && !isTailor) return res.status(403).json({ message: 'Access denied' })
    res.json(booking)
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['measurement_done', 'stitching', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user._id },
      { status },
      { new: true },
    )

    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const saveMeasurements = async (req, res) => {
  try {
    const { measurements } = req.body
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user._id },
      { measurements, status: 'measurement_done' },
      { new: true },
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    console.error('Save measurements error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const saveReview = async (req, res) => {
  try {
    const { rating, reviewComment } = req.body
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    booking.rating = rating
    booking.reviewComment = reviewComment
    await booking.save()

    if (booking.tailorProfile) {
      const profile = await TailorProfile.findById(booking.tailorProfile)
      if (profile) {
        const totalRating = profile.ratingAverage * profile.ratingCount + rating
        profile.ratingCount += 1
        profile.ratingAverage = totalRating / profile.ratingCount
        await profile.save()
      }
    }
    res.json(booking)
  } catch (error) {
    console.error('Save review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const markPaid = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
      { paymentStatus: 'paid' },
      { new: true },
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    console.error('Mark paid error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
