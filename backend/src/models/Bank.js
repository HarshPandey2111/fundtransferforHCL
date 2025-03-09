const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  bankId: {
    type: String,
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  transferCharge: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bank', bankSchema); 