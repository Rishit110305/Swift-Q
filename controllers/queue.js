const mongoose = require('mongoose');
const Department = require('../models/Department');
const Ticket = require('../models/Ticket');

// --- 1. GET QUEUE STATUS ---
module.exports.getQueueStatus = async (req, res) => {
  try {
    const { deptId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(deptId)) return res.status(400).json({ error: "Invalid ID" });

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ error: "Department not found" });

    const peopleWaiting = await Ticket.countDocuments({ departmentId: deptId, status: 'pending' });

    res.json({
      deptName: department.name,
      currentTicket: department.currentTicket,
      lastTicket: department.lastTicketAssigned,
      queueLength: peopleWaiting,
      count: peopleWaiting,
      waitTime: peopleWaiting * 15
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 2. JOIN QUEUE ---
module.exports.joinQueue = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { name, phone, deptId, userId } = req.body; 

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ error: "Department not found" });

    const existingTicket = await Ticket.findOne({ phone, departmentId: deptId, status: 'pending' });

    if (existingTicket) {
      return res.json({
        success: true,
        ticketNumber: existingTicket.ticketNumber,
        message: "You are already in the queue."
      });
    }

    const nextTicketNum = department.lastTicketAssigned + 1;

    const newTicket = new Ticket({
      userId: userId || null,
      departmentId: deptId,
      patientName: name,
      phone,
      ticketNumber: nextTicketNum,
      status: 'pending'
    });

    await newTicket.save();
    department.lastTicketAssigned = nextTicketNum;
    await department.save();

    if(io) io.emit(`update-${deptId}`, { trigger: "join" }); // This line is the Real-Time Notification switch. It is the code that tells the Frontend (the TV and Dashboard) to update instantly without needing to refresh the page.

    res.json({ success: true, ticketNumber: nextTicketNum });

  } catch (error) {
    console.error("Join Error:", error);
    res.status(500).json({ error: "Failed to join queue" });
  }
};

// --- 3. GET USER TICKETS ---
module.exports.getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.find({ userId, status: { $in: ['pending', 'serving'] } })
                                .populate('departmentId') // dept rltd info will be populate
                                .sort({ createdAt: -1 }); // This tells the database: "Don't just give me the tickets in random order. Sort them based on a specific rule."
                                // -1 (Descending)
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// --- 4. GET PENDING TICKETS (ADMIN DASHBOARD) ---
module.exports.getPendingTickets = async (req, res) => {
  try {
    const { deptId } = req.params;
    
    // Fetch pending AND serving tickets
    const tickets = await Ticket.find({ 
      departmentId: deptId, 
      status: { $in: ['pending', 'serving'] } 
    }).sort({ ticketNumber: 1 }); // order -> old to new 

    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// --- 5. CALL NEXT PATIENT ---
module.exports.nextPatient = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { deptId } = req.body;
    const department = await Department.findById(deptId);
    
    // Mark current serving as completed
    if (department.currentTicket > 0) {
      await Ticket.findOneAndUpdate(
        { departmentId: deptId, ticketNumber: department.currentTicket },
        { status: 'completed' }
      );
    }

    // Find next pending
    const nextTicket = await Ticket.findOne({ departmentId: deptId, status: 'pending' }).sort({ ticketNumber: 1 });

    if (!nextTicket) {
      // If no one is waiting, just clear the current ticket
      department.currentTicket = 0; 
      await department.save();
      return res.json({ message: "Queue is empty!" });
    }

    nextTicket.status = 'serving';
    await nextTicket.save();

    department.currentTicket = nextTicket.ticketNumber;
    await department.save();

    if(io) io.emit(`update-${deptId}`, { trigger: "next" });

    res.json({ success: true, currentTicket: nextTicket.ticketNumber });
  } catch (error) {
    console.error("Next Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};