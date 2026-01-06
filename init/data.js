const mongoose = require("mongoose");
const Department = require('../models/Department.js');

// 1. Define the URL (same as in app.js)
const MONGO_URL = 'mongodb://127.0.0.1:27017/swift-Q';

const departments = [
  // --- Original 3 ---
  {
    name: "General Medicine",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Cardiology",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Pediatrics",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  // --- Previous 4 ---
  {
    name: "Orthopedics",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Neurology",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Dermatology",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Gynecology",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  // --- NEW 2 (Total 9) ---
  {
    name: "ENT (Ear, Nose, Throat)",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  },
  {
    name: "Ophthalmology (Eye)",
    hospital: "City Hospital",
    currentTicket: 0,
    lastTicketAssigned: 0
  }
];

// 2. Connect to DB within the script
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const seedDB = async () => {
    try {
        // Connect first!
        await main();

        // Clear existing data
        await Department.deleteMany({});
        
        // Insert new data
        await Department.insertMany(departments);
        
        console.log('✅ Database Seeded Successfully!');
    } catch (err) {
        console.log("Error seeding DB:", err);
    } finally {
        // Close connection when done
        mongoose.connection.close();
    }
};

seedDB();