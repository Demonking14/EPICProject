import express from 'express'
import Inquiry from '../models/Inquiry.js'
import Product from '../models/Product.js'
import Message from '../models/Message.js'
import { protect, buyerOnly } from '../middleware/auth.js'

const router = express.Router()

// POST /api/inquiries — buyer requests a lot
router.post('/', protect, buyerOnly, async (req, res) => {
  try {
    const { productId, message } = req.body
    if (!productId) return res.status(400).json({ message: 'Product ID is required.' })
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    const inquiry = await Inquiry.create({
      product: productId,
      buyer: req.user._id,
      message: message || ''
    })
    await inquiry.populate(['product', 'buyer'])
    res.status(201).json(inquiry)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create inquiry.' })
  }
})

// GET /api/inquiries/my — my inquiries (buyer) or inquiries on my products (farmer)
router.get('/my', protect, async (req, res) => {
  try {
    if (req.user.role === 'buyer') {
      const list = await Inquiry.find({ buyer: req.user._id })
        .populate('product')
        .populate('product.farmer', 'name email')
        .sort({ createdAt: -1 })
        .lean()
      return res.json(list)
    }
    const list = await Inquiry.find()
      .populate('product')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    const forMyProducts = list.filter((i) => i.product?.farmer?.toString() === req.user._id.toString())
    res.json(forMyProducts)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch inquiries.' })
  }
})

// GET /api/inquiries/:id — single inquiry (participant only)
router.get('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate({ path: 'product', populate: { path: 'farmer', select: 'name email' } })
      .populate('buyer', 'name email')
      .lean()
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' })
    const isBuyer = inquiry.buyer?._id?.toString() === req.user._id.toString()
    const isFarmer = inquiry.product?.farmer?._id?.toString() === req.user._id.toString()
    if (!isBuyer && !isFarmer) return res.status(403).json({ message: 'Not allowed to view this inquiry.' })
    res.json(inquiry)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch inquiry.' })
  }
})

// PUT /api/inquiries/:id — farmer accept/reject
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected.' })
    }
    const inquiry = await Inquiry.findById(req.params.id).populate('product')
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' })
    const farmerId = inquiry.product?.farmer?.toString?.() || inquiry.product?.farmer
    if (farmerId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the product farmer can accept or reject.' })
    }
    inquiry.status = status
    await inquiry.save()
    await inquiry.populate(['product', 'buyer'])
    res.json(inquiry)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update inquiry.' })
  }
})

// GET /api/inquiries/:id/messages — chat history (participant only)
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('product')
      .lean()
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' })
    const isBuyer = inquiry.buyer?.toString() === req.user._id.toString()
    const farmerId = inquiry.product?.farmer?.toString?.() || inquiry.product?.farmer
    const isFarmer = farmerId === req.user._id.toString()
    if (!isBuyer && !isFarmer) return res.status(403).json({ message: 'Not allowed to view this chat.' })
    const messages = await Message.find({ inquiry: req.params.id })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 })
      .lean()
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch messages.' })
  }
})

export default router
