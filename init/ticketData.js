const mongoose = require("mongoose");
const Ticket = require('../models/Ticket'); 
const Department = require('../models/Department');

const MONGO_URL = 'mongodb://127.0.0.1:27017/swift-Q';

const seedTickets = async () => {
  // 1. Get the Cardiology Department ID
  const cardioDept = await Department.findOne({ name: "Cardiology" });
  
  if (!cardioDept) {
    console.log("❌ Error: 'Cardiology' department not found. Run the Department seed first!");
    return;
  }

  const tickets = [
    {
      patientName: "Amit Kumar",
      phone: "9998887771",
      departmentId: cardioDept._id, 
      ticketNumber: 1,
      status: "completed"
    },
    {
      patientName: "Sita Verma",
      phone: "9998887772",
      departmentId: cardioDept._id,
      ticketNumber: 2,
      status: "serving" // Currently with doctor
    },
    {
      patientName: "John Doe",
      phone: "9998887773",
      departmentId: cardioDept._id,
      ticketNumber: 3,
      status: "pending" // Waiting
    }
  ];

  // 2. Clear old tickets and insert new ones
  await Ticket.deleteMany({});
  await Ticket.insertMany(tickets);
  
  // 3. CRITICAL: Update Department state to match these tickets
  cardioDept.lastTicketAssigned = 3; // Because John Doe is #3
  cardioDept.currentTicket = 2;      // Because Sita Verma (#2) is "serving"
  await cardioDept.save();

  console.log('✅ Tickets Seeded & Department Updated!');
};

// 4. MAIN EXECUTION BLOCK (This was missing)
const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("🔌 Connected to DB");
    
    // Run the seed function
    await seedTickets();

    // Close connection so the script ends
    await mongoose.connection.close();
    console.log("👋 Connection Closed");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

main();