const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = 'mongodb://127.0.0.1:27017/innovationNetworkBuilderBD'; // Hardcoded for testing
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
