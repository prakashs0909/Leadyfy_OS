const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leadyfy_os';
    
    // Set low server selection timeout so fallback triggers quickly if local mongodb is off
    mongoose.set('strictQuery', false);
    
    try {
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    } catch (localErr) {
      console.log('[Database] Standalone MongoDB connection failed or not running. Starting MongoMemoryServer fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${mongoUri}`);
    }
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
