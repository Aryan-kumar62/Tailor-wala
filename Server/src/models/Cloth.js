import mongoose from 'mongoose'

const clothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerMeter: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unstitched', 'Fabric'],
      required: true,
    },
    image: {
      type: String, // URL to image
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Cloth = mongoose.model('Cloth', clothSchema)

export default Cloth
