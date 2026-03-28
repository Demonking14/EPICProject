import express from 'express'
import { protect } from '../middleware/auth.js'
import { schemes } from '../data/schemesData.js'

const router = express.Router()


router.get('/', protect, (req, res) => {
    try {
        const { state, landSize } = req.query

        let filteredSchemes = schemes

    
        if (state) {
            filteredSchemes = filteredSchemes.filter(
                (s) => s.state === 'All' || s.state.toLowerCase() === state.toLowerCase()
            )
        }
      
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
