require('dotenv').config(); // Load environment variables (.env)
const mongoose = require('mongoose');
const Department = require('./models/Department'); // Ensure this path matches your model location!

// The 9 Departments Data
const departments = [
  { name: "Cardiology", hospital: "City General Hospital", active: true },
  { name: "Neurology", hospital: "City General Hospital", active: true },
  { name: "Orthopedics", hospital: "St. Mary's Medical Center", active: true },
  { name: "Pediatrics", hospital: "Children's Health Clinic", active: true },
  { name: "Dermatology", hospital: "Skin & Care Center", active: true },
  { name: "Oncology", hospital: "Hope Cancer Institute", active: true },
  { name: "ENT (Ear, Nose, Throat)", hospital: "City General Hospital", active: true },
  { name: "Gynecology", hospital: "Women's Wellness Center", active: true },
  { name: "Dental Care", hospital: "Bright Smile Clinic", active: true }
];

const seedDB = async () => {
  try {
    // 1. Connect to MongoDB Atlas (Cloud)
    // Make sure your .env file has the MONGO_URI variable!
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB Atlas");

    // 2. Clear old data (Optional: removes duplicates if you run this twice)
    await Department.deleteMany({});
    console.log("🧹 Cleared existing departments");

    // 3. Insert the new 9 departments
    await Department.insertMany(departments);
    console.log("🌱 Database Seeded with 9 Departments!");

    // 4. Disconnect
    mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

// Run the function
seedDB();