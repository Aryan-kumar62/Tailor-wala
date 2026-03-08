import mongoose from 'mongoose'

const tailorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    basePrice: {
      type: Number,
      default: 0,
    },
    photos: [
      {
        type: String,
      },
    ],
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const TailorProfile = mongoose.model('TailorProfile', tailorProfileSchema)

export default TailorProfile

