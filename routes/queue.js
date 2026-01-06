const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue');

// 1. GET WAITING TIME (For Patient "Join" Screen)
router.get('/length/:deptId', queueController.getQueueStatus);

// 2. JOIN QUEUE (Patient joins)
router.post('/join', queueController.joinQueue);

// 3. GET USER TICKETS (For "My Tickets" Page)
router.get('/user/:userId', queueController.getUserTickets);

// 4. GET PENDING LIST (For Admin Dashboard) 
router.get('/list/:deptId', queueController.getPendingTickets);

// 5. CALL NEXT PATIENT (For Admin Button)
router.post('/next', queueController.nextPatient);

module.exports = router;