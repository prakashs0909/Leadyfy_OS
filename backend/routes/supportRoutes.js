const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTickets);
router.post('/', createTicket);
router.put('/:id', updateTicket);

module.exports = router;
