# Fund Transfer System

A full-stack application for finding optimal fund transfer routes between banks based on cost and time.

## Features

- User authentication (register/login)
- Find optimal transfer routes between banks
- View transaction history
- Modern, responsive UI
- Real-time route calculation
- Support for multiple banks and transfer paths

## Tech Stack

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd fund-transfer-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fund-transfer
JWT_SECRET=your_jwt_secret_key
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5003

## API Endpoints

### Users
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### Banks
- GET /api/banks - Get all banks
- POST /api/banks - Add a new bank
- POST /api/banks/optimal-route - Get optimal transfer routes

### Transactions
- POST /api/transactions - Create a new transaction
- GET /api/transactions/user/:userId - Get user's transactions
- PATCH /api/transactions/:id - Update transaction status

## Database Schema

### Users
- username (String, required)
- email (String, required, unique)
- password (String, required)
- createdAt (Date)

### Banks
- bankId (String, required, unique)
- bankName (String, required)
- transferCharge (Number, required)
- createdAt (Date)

### Transactions
- sourceBank (ObjectId, ref: 'Bank')
- destinationBank (ObjectId, ref: 'Bank')
- amount (Number, required)
- transferTime (Number, required)
- transferCost (Number, required)
- status (String, enum: ['pending', 'completed', 'failed'])
- userId (ObjectId, ref: 'User')
- createdAt (Date)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 