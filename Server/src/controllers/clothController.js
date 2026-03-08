import Cloth from '../models/Cloth.js'

export const getCloths = async (req, res) => {
  try {
    const category = req.query.category
    const query = category ? { category } : {}
    const cloths = await Cloth.find(query)
    res.json(cloths)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const getClothById = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id)
    if (cloth) {
      res.json(cloth)
    } else {
      res.status(404).json({ message: 'Cloth not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const createCloth = async (req, res) => {
  try {
    const { name, description, pricePerMeter, category, image, stock } = req.body
    const cloth = new Cloth({
      name,
      description,
      pricePerMeter,
      category,
      image,
      stock,
    })
    const createdCloth = await cloth.save()
    res.status(201).json(createdCloth)
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message })
  }
}

export const seedCloths = async (req, res) => {
  try {
    const dummyCloths = [
      {
        name: 'Egyptian Cotton',
        description: 'Ultra-soft and breathable, harvested from the banks of the Nile. Perfect for bespoke dress shirts.',
        pricePerMeter: 850,
        category: 'Fabric',
        image: 'https://images.unsplash.com/photo-1524385175510-72e2cf5e1e48?auto=format&fit=crop&q=80&w=800',
        stock: 50,
        rating: 4.9,
      },
      {
        name: 'Pure Mulberry Silk',
        description: 'The finest silk in the world, known for its natural sheen and incredible strength.',
        pricePerMeter: 3200,
        category: 'Fabric',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
        stock: 25,
        rating: 5.0,
      },
      {
        name: 'Cashmere Wool',
        description: 'Exceptionally warm and soft wool sourced from the underside of cashmere goats.',
        pricePerMeter: 4500,
        category: 'Fabric',
        image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&q=80&w=800',
        stock: 15,
        rating: 4.8,
      },
      {
        name: 'Belgian Linen',
        description: 'Sustainable and durable linen with a crisp texture, ideal for summer suits.',
        pricePerMeter: 1200,
        category: 'Unstitched',
        image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&q=80&w=800',
        stock: 40,
        rating: 4.7,
      },
      {
        name: 'French Chantilly Lace',
        description: 'Intricate and delicate lace, handmade with traditional French techniques.',
        pricePerMeter: 5500,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1524385175510-72e2cf5e1e48?auto=format&fit=crop&q=80&w=800',
        stock: 10,
        rating: 4.9,
      }
    ]

    await Cloth.deleteMany()
    await Cloth.insertMany(dummyCloths)
    res.json({ message: 'Cloths seeded successfully', count: dummyCloths.length })
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed', error: error.message })
  }
}
