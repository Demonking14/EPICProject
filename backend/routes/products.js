import express from 'express'
import Product from '../models/Product.js'
import { protect, farmerOnly } from '../middleware/auth.js'
import { uploadProductImage } from '../middleware/upload.js'

const router = express.Router()
const baseUrl = process.env.BASE_URL || 'http://localhost:5000'

// GET /api/products — list all (for marketplace); query: search, category
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query
    const filter = {}
    if (search?.trim()) {
      filter.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
        { location: new RegExp(search.trim(), 'i') }
      ]
    }
    if (category && category !== 'All produce') {
      filter.category = category
    }
    const products = await Product.find(filter)
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    const withImageUrl = products.map((p) => ({
      ...p,
      imageUrl: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${baseUrl}/uploads/${p.imageUrl}`) : null
    }))
    res.json(withImageUrl)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch products.' })
  }
})

// GET /api/products/my — my products (farmer only)
router.get('/my', protect, farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch your products.' })
  }
})

// POST /api/products — create (farmer only, with optional image)
router.post('/', protect, farmerOnly, (req, res, next) => {
  uploadProductImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed.' })
    }
    try {
      const { name, description, price, quantity, location, category, availability, unit } = req.body
      if (!name || !description || price == null || quantity == null || !location) {
        return res.status(400).json({ message: 'Name, description, price, quantity and location are required.' })
      }
      const imageUrl = req.file ? req.file.filename : null
      const product = await Product.create({
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        location,
        category: category || 'Other',
        availability: availability || 'Immediate',
        unit: unit || 'kg',
        farmer: req.user._id,
        imageUrl
      })
      res.status(201).json(product)
    } catch (e) {
      res.status(500).json({ message: e.message || 'Failed to create product.' })
    }
  })
})

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email').lean()
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    if (product.imageUrl && !product.imageUrl.startsWith('http')) {
      product.imageUrl = `${baseUrl}/uploads/${product.imageUrl}`
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch product.' })
  }
})

// PUT /api/products/:id — update (farmer, own only)
router.put('/:id', protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id })
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    const { name, description, price, quantity, location, category, availability, status } = req.body
    if (name != null) product.name = name
    if (description != null) product.description = description
    if (price != null) product.price = Number(price)
    if (quantity != null) product.quantity = Number(quantity)
    if (location != null) product.location = location
    if (category != null) product.category = category
    if (availability != null) product.availability = availability
    if (status != null) product.status = status
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update product.' })
  }
})

// DELETE /api/products/:id — delete (farmer, own only)
router.delete('/:id', protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user._id })
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json({ message: 'Product removed.' })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete product.' })
  }
})

export default router
