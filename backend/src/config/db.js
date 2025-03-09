const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
// Create indexes
    await Promise.all([
      conn.connection.collection('banks').createIndex({ bic: 1 }, { unique: true }),
      conn.connection.collection('transactions').createIndex({ userId: 1 }),
      conn.connection.collection('transactions').createIndex({ createdAt: -1 })
    ]).catch(err => {
      console.warn('Warning: Index creation failed:', err.message);

    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('Authentication failed. Please check your MongoDB credentials in .env file');
    } else if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
      return;
    }
    process.exit(1);
  }
};

module.exports = connectDB; 