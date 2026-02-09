import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' })
    }
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be farmer or buyer.' })
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ message: 'Email already exists! Please use a different email or log in.' })
    }
    const user = await User.create({ name, email: email.trim().toLowerCase(), password, role })
    const token = generateToken(user._id)
    res.status(201).json({
      user: user.toJSON(),
      token
    })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password! Please try again or sign up.' })
    }
    const token = generateToken(user._id)
    res.json({
      user: user.toJSON(),
      token
    })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed.' })
  }
})

// GET /api/auth/me (optional - verify token and return current user)
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found.' })
    res.json({ user: user.toJSON() })
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
})

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const { name, phone, age, gender, address } = req.body

    // Update fields
    if (name) user.name = name
    if (phone) user.phone = phone
    if (age) user.age = age
    if (gender) user.gender = gender
    if (address) user.address = address

    await user.save()

    res.json({
      message: 'Profile updated successfully.',
      user: user.toJSON()
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Profile update failed.' })
  }
})

export default router
