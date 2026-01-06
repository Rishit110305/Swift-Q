const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  // Link to the User (so we know whose ticket this is)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Link to the Department
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'serving', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);