import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import { connectDB } from '../config/db.js'

dotenv.config()

async function run() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Successfully connected to database.')
    
    // Find all users who are not verified
    const unverifiedUsers = await User.find({ isVerified: { $ne: true } })
    console.log(`Found ${unverifiedUsers.length} unverified users.`)

    if (unverifiedUsers.length > 0) {
      console.log('Verifying them now...')
      const result = await User.updateMany(
        { isVerified: { $ne: true } },
        { 
          $set: { isVerified: true },
          $unset: { verificationToken: "", verificationTokenExpires: "" } 
        }
      )
      console.log(`Successfully verified ${result.modifiedCount} old accounts!`)
    }
  } catch (error) {
    console.error('Error verifying old users:', error)
  } finally {
    console.log('Closing connection...')
    mongoose.connection.close()
    process.exit(0)
  }
}

run()
