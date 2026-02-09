import express from 'express'
import { protect } from '../middleware/auth.js'
import { fetchMandiPrices } from '../services/mandiService.js'

const router = express.Router()

/**
 * GET /api/mandi/prices
 * Query: state, district, commodity, limit, offset, pricePerKg (0|1)
 * Auth: required (farmer or buyer)
 */
router.get('/prices', protect, async (req, res) => {
  try {
    const { state, district, commodity, limit, offset, pricePerKg } = req.query
    const data = await fetchMandiPrices({
      state: state || undefined,
      district: district || undefined,
      commodity: commodity || undefined,
      limit: limit ? Number(limit) : 100,
      offset: offset ? Number(offset) : 0,
      pricePerKg: pricePerKg !== '0' && pricePerKg !== 'false'
    })
    res.json(data)
  } catch (err) {
    console.error('Mandi prices error:', err.message)
    res.status(500).json({
      message: err.message || 'Failed to fetch mandi prices. Check MANDI_API_KEY and try again.'
    })
  }
})

import { mspList, marketRates } from '../data/mspData.js'

// GET /api/mandi/msp
router.get('/msp', protect, (req, res) => {
  res.json(mspList)
})

// POST /api/mandi/compare-price
router.post('/compare-price', protect, (req, res) => {
  try {
    const { crop, state, price } = req.body
    if (!crop || !price) {
      return res.status(400).json({ message: 'Crop and price are required.' })
    }

    const mspItem = mspList.find((item) => item.crop.toLowerCase().includes(crop.toLowerCase()))
    const msp = mspItem ? mspItem.price : 0

    // Try to get avg market rate for state, fallback to global avg if needed or just random variance for demo
    let marketRate = 0
    if (state && marketRates[state] && marketRates[state][crop]) {
      marketRate = marketRates[state][crop]
    } else {
      // Demo logic: average market rate is usually close to MSP (+/- 10%)
      marketRate = msp > 0 ? msp + (Math.random() * 200 - 100) : Number(price)
    }

    const offeredPrice = Number(price)
    const difference = offeredPrice - msp
    const isGoodDeal = offeredPrice >= msp

    res.json({
      crop,
      offeredPrice,
      msp,
      marketRate: Math.round(marketRate),
      isGoodDeal,
      verdict: isGoodDeal ? 'Good Deal' : 'Below MSP',
      difference: Math.abs(Math.round(difference))
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
