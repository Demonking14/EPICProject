import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'kg' },
    location: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Cereals', 'Vegetables', 'Fruits', 'Spices', 'Other'], default: 'Other' },
    availability: { type: String, enum: ['Immediate', 'Within 7 days', 'Within 30 days'], default: 'Immediate' },
    imageUrl: { type: String, default: null },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Listed', 'Negotiating', 'Sample sent', 'Sold'], default: 'Listed' }
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
