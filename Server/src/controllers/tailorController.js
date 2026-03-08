import TailorProfile from '../models/TailorProfile.js'
import Booking from '../models/Booking.js'

export const createProfile = async (req, res) => {
  try {
    const { bio, experienceYears, specializations, basePrice, city, pincode } = req.body

    const payload = {
      user: req.user._id,
      bio,
      experienceYears,
      specializations,
      basePrice,
      city,
      pincode,
    }

    const profile = await TailorProfile.findOneAndUpdate(
      { user: req.user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )

    res.json(profile)
  } catch (error) {
    console.error('Tailor profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const profile = await TailorProfile.findOne({ user: req.user._id })
    res.json(profile)
  } catch (error) {
    console.error('Get tailor profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getEarnings = async (req, res) => {
  try {
    const COMMISSION_RATE = 0.15
    const delivered = await Booking.find({
      tailor: req.user._id,
      status: 'delivered',
      paymentStatus: 'paid',
    })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
    const transactions = delivered.map((b) => {
      const fee = Math.round(b.price * COMMISSION_RATE * 100) / 100
      const net = Math.round((b.price - fee) * 100) / 100
      return {
        _id: b._id,
        date: b.updatedAt,
        orderId: `#ORD-${b._id.toString().slice(-4)}`,
        customer: b.customer?.name,
        service: b.serviceType,
        amount: b.price,
        fee,
        netEarned: net,
      }
    })
    const totalEarnings = transactions.reduce((s, t) => s + t.netEarned, 0)
    const now = new Date()
    const thisMonth = transactions.filter(
      (t) => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()
    )
    const monthlyEarnings = thisMonth.reduce((s, t) => s + t.netEarned, 0)
    const pending = await Booking.find({
      tailor: req.user._id,
      status: { $in: ['stitching', 'ready_for_delivery', 'out_for_delivery'] },
      paymentStatus: 'paid',
    })
    const pendingPayout = pending.reduce((s, b) => {
      const fee = b.price * COMMISSION_RATE
      return s + (b.price - fee)
    }, 0)
    res.json({
      totalEarnings,
      monthlyEarnings,
      pendingPayout: Math.round(pendingPayout * 100) / 100,
      transactions,
    })
  } catch (error) {
    console.error('Earnings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const listTailors = async (req, res) => {
  try {
    const { city, specialization } = req.query

    const query = {}
    if (city) {
      query.city = new RegExp(`^${city}$`, 'i')
    }
    if (specialization) {
      query.specializations = { $in: [new RegExp(specialization, 'i')] }
    }

    const tailors = await TailorProfile.find(query)
      .populate('user', 'name city pincode role')
      .sort({ ratingAverage: -1 })

    res.json(tailors)
  } catch (error) {
    console.error('List tailors error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getTailorById = async (req, res) => {
  try {
    const profile = await TailorProfile.findById(req.params.id).populate(
      'user',
      'name city pincode role',
    )
    if (!profile) {
      return res.status(404).json({ message: 'Tailor not found' })
    }
    res.json(profile)
  } catch (error) {
    console.error('Get tailor error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
