const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: { type: String, required: true },
  currentTicket: { type: Number, default: 0 },
  lastTicketAssigned: { type: Number, default: 0 },
});

module.exports = mongoose.model("Department", departmentSchema);
