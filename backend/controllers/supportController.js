const SupportTicket = require('../models/SupportTicket');
const { logActivity, notify } = require('../utils/logger');

const getTickets = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const tickets = await SupportTicket.find(query)
      .populate('client', 'clientName companyName email')
      .populate('assignedEmployee', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { client, subject, description, priority } = req.body;

    const clientId = req.user.role === 'CLIENT' ? req.user.clientId : client;
    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    const ticket = await SupportTicket.create({
      client: clientId,
      subject,
      description,
      priority: priority || 'Medium',
      createdBy: req.user._id,
      status: 'Open',
    });

    await logActivity(req, 'CREATE_SUPPORT_TICKET', 'SupportTicket', ticket._id, `Ticket created: "${subject}"`);
    await notify({
      roleTarget: 'ALL',
      title: 'New Support Ticket Created',
      message: `Support ticket: "${subject}" has been submitted.`,
      type: 'warning',
      link: `/support`,
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('client assignedEmployee');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found' });
    }

    await logActivity(req, 'UPDATE_SUPPORT_TICKET', 'SupportTicket', ticket._id, `Updated ticket status to ${ticket.status}`);

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getTickets, createTicket, updateTicket };
