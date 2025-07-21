const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter'
  },
  idNumber: {
    type: String,
    trim: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedElections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 