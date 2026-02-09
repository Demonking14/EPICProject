import express from 'express'
import { protect } from '../middleware/auth.js'
import { schemes } from '../data/schemesData.js'

const router = express.Router()

// GET /api/schemes?state=Punjab&landSize=2
router.get('/', protect, (req, res) => {
    try {
        const { state, landSize } = req.query

        let filteredSchemes = schemes

        // Filter by State (Central schemes 'All' + Specific State)
        if (state) {
            filteredSchemes = filteredSchemes.filter(
                (s) => s.state === 'All' || s.state.toLowerCase() === state.toLowerCase()
            )
        }

        // Filter by Land Size (if scheme has a limit)
        if (landSize) {
            const size = Number(landSize)
            filteredSchemes = filteredSchemes.filter((s) => s.maxLandSize >= size)
        }

        res.json(filteredSchemes)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch schemes.' })
    }
})

export default router
