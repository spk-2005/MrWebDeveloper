// pages/api/lib/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global cache ensures:
 * - In dev: prevents multiple connections during hot reload
 * - In prod: ensures a single, pooled connection is reused
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,        // Disable mongoose buffering
      maxPoolSize: 10,              // Max 10 connections in pool
      minPoolSize: 2,               // Keep at least 2 idle connections
      serverSelectionTimeoutMS: 5000, // Fail if no server within 5s
      socketTimeoutMS: 45000,       // Close idle sockets after 45s
      family: 4,                    // Force IPv4 (faster in some envs)
    };

    console.log('🔌 Creating new MongoDB connection (pooled)...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB (pooled connection)');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      cached.promise = null; // Reset so we can retry later
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
