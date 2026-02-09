import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import Inquiry from './models/Inquiry.js'
import Message from './models/Message.js'

export function setupSocket (httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token
    if (!token) return next(new Error('Auth required'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('join_inquiry', async (inquiryId, cb) => {
      try {
        const inquiry = await Inquiry.findById(inquiryId).populate('product').lean()
        if (!inquiry) return cb?.({ error: 'Inquiry not found' })
        const buyerId = inquiry.buyer?.toString()
        const farmerId = (inquiry.product?.farmer?._id ?? inquiry.product?.farmer)?.toString?.()
        const uid = socket.userId.toString()
        if (uid !== buyerId && uid !== farmerId) return cb?.({ error: 'Not a participant' })
        socket.inquiryId = inquiryId
        socket.join(`inquiry:${inquiryId}`)
        cb?.({ ok: true })
      } catch (err) {
        cb?.({ error: err.message })
      }
    })

    socket.on('send_message', async ({ inquiryId, text }, cb) => {
      try {
        if (!inquiryId || !text?.trim()) return cb?.({ error: 'inquiryId and text required' })
        const inquiry = await Inquiry.findById(inquiryId).populate('product').lean()
        if (!inquiry) return cb?.({ error: 'Inquiry not found' })
        const buyerId = inquiry.buyer?.toString()
        const farmerId = (inquiry.product?.farmer?._id ?? inquiry.product?.farmer)?.toString?.()
        const uid = socket.userId.toString()
        if (uid !== buyerId && uid !== farmerId) return cb?.({ error: 'Not a participant' })
        const msg = await Message.create({
          inquiry: inquiryId,
          sender: uid,
          text: text.trim()
        })
        await msg.populate('sender', 'name role')
        const payload = msg.toObject()
        io.to(`inquiry:${inquiryId}`).emit('new_message', payload)
        cb?.({ ok: true, message: payload })
      } catch (err) {
        cb?.({ error: err.message })
      }
    })

    socket.on('disconnect', () => {})
  })

  return io
}
