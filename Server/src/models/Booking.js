import mongoose from 'mongoose'

const measurementFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: 'inch' },
  },
  { _id: false },
)

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tailorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TailorProfile',
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'measurement_scheduled',
        'measurement_done',
        'stitching',
        'ready_for_delivery',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    measurements: [measurementFieldSchema],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviewComment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking

