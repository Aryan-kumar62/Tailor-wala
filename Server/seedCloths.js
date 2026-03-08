import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Cloth from './src/models/Cloth.js'
import connectDB from './src/config/db.js'

dotenv.config()

connectDB()

const cloths = [
  {
    name: 'Premium Cotton Fabric',
    description: 'High-quality 100% cotton fabric, perfect for shirts and summer dresses.',
    pricePerMeter: 450,
    category: 'Unstitched',
    image: 'https://images.unsplash.com/photo-1524385175510-72e2cf5e1e48?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Italian Silk',
    description: 'Luxurious silk fabric with a smooth finish, ideal for evening wear.',
    pricePerMeter: 1200,
    category: 'Fabric',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: 'Linen Blend',
    description: 'Breathable linen-cotton blend for comfortable daily wear.',
    pricePerMeter: 350,
    category: 'Unstitched',
    image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    rating: 4.2,
    numReviews: 15,
  },
  {
    name: "Men's Suit Wool",
    description: 'Fine wool fabric for tailored suits and formal trousers.',
    pricePerMeter: 2500,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    rating: 4.9,
    numReviews: 5,
  },
  {
    name: 'Floral Print Chiffon',
    description: 'Soft and lightweight chiffon with beautiful floral patterns.',
    pricePerMeter: 300,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1524385175510-72e2cf5e1e48?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    rating: 4.6,
    numReviews: 20,
  },
]

const seedData = async () => {
  try {
    await Cloth.deleteMany()
    await Cloth.insertMany(cloths)
    console.log('Data Seeded Successfully!')
    process.exit()
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()
