const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const http = require('http');               
const { Server } = require("socket.io");   
const cors = require('cors'); // Cross-Origin Resource Sharing
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Import Route Files
const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/department');
const queueRoutes = require('./routes/queue');

const app = express();
const port = 8080;
const url = 'mongodb://127.0.0.1:27017/swift-Q';

// 1. Database Connection
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}
connect();

//  SETUP SOCKET.IO 
const server = http.createServer(app); 
const io = new Server(server, {        
  cors: {
    origin: "http://localhost:5173",   // FrontEnd 
    methods: ["GET", "POST"]
  }
});

// Store io instance in app so controllers can use it
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('⚡ A user connected via Socket.io');
});

// 2. Middleware Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json()); 
app.use(cors());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// 3. Register Routes
app.get("/", (req, res) => {
    res.send("<h1>SwiftQ Server is Running 🚀</h1>");
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes); // All routes inside start with /api/departments
app.use('/api/queue', queueRoutes); // Contains /join-queue, /next-patient, /queue-status/:deptId

// 4. Start Server
// IMPORTANT: Use 'server.listen', not 'app.listen' when using Socket.io with HTTP server
server.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
});