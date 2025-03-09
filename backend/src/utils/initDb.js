const mongoose = require('mongoose');
const { loadBanksData, loadLinksData } = require('./csvLoader');
require('dotenv').config();

const initializeDatabase = async () => {
  let connection;
  try {
    console.log('Connecting to MongoDB...');
    connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
      socketTimeoutMS: 45000
    });
    console.log('Connected to MongoDB');

    console.log('Loading data from CSV files...');
    const [banks, links] = await Promise.all([
      loadBanksData().catch(error => {
        console.error('Error loading banks.csv:', error.message);
        return [];
      }),
      loadLinksData().catch(error => {
        console.error('Error loading links.csv:', error.message);
        return [];
      })
    ]);

    if (!banks.length) {
      throw new Error('No bank data loaded from banks.csv');
    }

    if (!links.length) {
      throw new Error('No link data loaded from links.csv');
    }

    console.log(`Loaded ${banks.length} banks and ${links.length} links`);

    // Get database instance
    const db = connection.connection.db;

//for bank collection
    console.log('Initializing banks collection...');
    const banksCollection = db.collection('banks');
    await banksCollection.deleteMany({});
    await banksCollection.insertMany(banks);
    await banksCollection.createIndex({ bic: 1 }, { unique: true });
    console.log(`Inserted ${banks.length} banks`);

//for link collection
    console.log('Initializing links collection...');
    const linksCollection = db.collection('links');
    await linksCollection.deleteMany({});
    await linksCollection.insertMany(links);
    await linksCollection.createIndex({ fromBic: 1, toBic: 1 }, { unique: true });
    console.log(`Inserted ${links.length} links`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('\nError initializing database:');
    console.error(error.message);
    
    if (error.name === 'MongoServerError') {
      if (error.code === 8000) {
        console.error('\nAuthentication failed. Please check:');
        console.error('1. Your MongoDB username and password in .env file');
        console.error('2. Your IP address is whitelisted in MongoDB Atlas');
        console.error('3. The database user has the correct permissions');
      } else {
        console.error('\nMongoDB Error. Please check:');
        console.error('1. MongoDB connection string format');
        console.error('2. Database and collection names');
        console.error('3. Write permissions');
      }
    }
  } finally {
    if (connection) {
      console.log('Closing database connection...');
      await connection.connection.close();
    }
    process.exit(0);
  }
};


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

initializeDatabase(); 