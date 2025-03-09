const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: process.env.ACTUAL_PORT });
});


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/banks', require('./routes/bankRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const startServer = async () => {
  try {
    const port = parseInt(process.env.PORT || '5000', 10);
    let currentPort = port;
    let maxAttempts = 10;
    let server;

    while (maxAttempts > 0) {
      try {
        server = await new Promise((resolve, reject) => {
          const s = app.listen(currentPort, () => resolve(s))
            .on('error', (err) => {
              if (err.code === 'EADDRINUSE') {
                currentPort++;
                reject(err);
              } else {
                reject(err);
              }
            });
        });
        break;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${currentPort - 1} is in use, trying ${currentPort}...`);
          maxAttempts--;
          if (maxAttempts === 0) {
            throw new Error('Could not find an available port');
          }
          continue;
        }
        throw err;
      }
    }

    console.log(`Server running on port ${currentPort}`);
    process.env.ACTUAL_PORT = currentPort.toString();

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};


process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

startServer(); 