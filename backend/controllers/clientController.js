const Client = require('../models/Client');
const Order = require('../models/Order');
const Script = require('../models/Script');
const Shoot = require('../models/Shoot');
const Video = require('../models/Video');
const Payment = require('../models/Payment');
const SupportTicket = require('../models/SupportTicket');
const ActivityLog = require('../models/ActivityLog');
const { logActivity, notify } = require('../utils/logger');

const getClients = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.find(query).populate('assignedEmployee', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, count: clients.length, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('assignedEmployee', 'name email role');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Fetch related downstream entity summary for centralized hub view
    const orders = await Order.find({ client: client._id }).sort({ createdAt: -1 });
    const scripts = await Script.find({ client: client._id }).populate('writer creator').sort({ createdAt: -1 });
    const shoots = await Shoot.find({ client: client._id }).populate('creator shootManager').sort({ createdAt: -1 });
    const videos = await Video.find({ client: client._id }).populate('assignedEditor creator').sort({ createdAt: -1 });
    const payments = await Payment.find({ client: client._id }).sort({ createdAt: -1 });
    const tickets = await SupportTicket.find({ client: client._id }).sort({ createdAt: -1 });
    const activityLogs = await ActivityLog.find({ entityId: client._id.toString() }).sort({ timestamp: -1 });

    res.json({
      success: true,
      client,
      relatedData: {
        orders,
        scripts,
        shoots,
        videos,
        payments,
        tickets,
        activityLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    // Normalization check for company vs companyName to prevent any API mismatch
    const payload = { ...req.body };
    if (!payload.companyName && payload.company) {
      payload.companyName = payload.company;
    }

    if (!payload.clientName || !payload.companyName || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'clientName, companyName, and email are required fields',
      });
    }

    const client = await Client.create(payload);

    await logActivity(req, 'CREATE_CLIENT', 'Client', client._id, `Created client ${client.clientName} (${client.companyName})`);
    await notify({
      roleTarget: 'ALL',
      title: 'New Client Onboarding',
      message: `Client ${client.clientName} (${client.companyName}) has been onboarded!`,
      type: 'success',
      link: `/clients/${client._id}`,
    });

    res.status(201).json({ success: true, client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.companyName && payload.company) {
      payload.companyName = payload.company;
    }

    const client = await Client.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate('assignedEmployee', 'name email role');

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await logActivity(req, 'UPDATE_CLIENT', 'Client', client._id, `Updated client profile ${client.clientName}`);

    res.json({ success: true, client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    client.status = 'Inactive';
    await client.save();

    await logActivity(req, 'DEACTIVATE_CLIENT', 'Client', client._id, `Deactivated client ${client.clientName}`);

    res.json({ success: true, message: 'Client set to Inactive status', client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
