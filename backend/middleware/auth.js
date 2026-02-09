import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found.' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

export const farmerOnly = (req, res, next) => {
  if (req.user?.role !== 'farmer') {
    return res.status(403).json({ message: 'Farmer access only.' })
  }
  next()
}

export const buyerOnly = (req, res, next) => {
  if (req.user?.role !== 'buyer') {
    return res.status(403).json({ message: 'Buyer access only.' })
  }
  next()
}
