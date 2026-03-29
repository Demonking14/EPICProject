import express from 'express'
import { GoogleGenAI } from '@google/genai'

const router = express.Router()

// We initialize the client if the key is present.
// If it's not present, we can throw an error or handle it gracefully in the route.
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null

const SYSTEM_INSTRUCTION = `You are a helpful and knowledgeable agricultural expert AI assistant for the 'AgriMarket' platform. 
Your goal is to assist farmers and buyers with questions regarding agriculture, crop pricing, subsidies, marketplace trading, and general farming best practices. 
Keep your answers concise, practical, and friendly.`

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' })
    }

    if (!ai) {
      return res.status(500).json({ message: 'AI is not configured. Missing GEMINI_API_KEY.' })
    }

    // Format messages for @google/genai SDK
    // The SDK expects the system instruction to be part of the config when calling generateContent
    // User messages should be mapped to the expected format.
    const contents = messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }))

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    })

    const replyText = response.text || 'Sorry, I couldn\'t generate a response.'
    res.json({ reply: replyText })
  } catch (error) {
    console.error('Error generating AI response:', error)
    res.status(500).json({ message: 'Failed to generate AI response' })
  }
})

export default router
