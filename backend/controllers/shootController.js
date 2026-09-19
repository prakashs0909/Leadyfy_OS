const Shoot = require('../models/Shoot');
const Creator = require('../models/Creator');
const Video = require('../models/Video');
const { logActivity, notify } = require('../utils/logger');

const getShoots = async (req, res) => {
  try {
    const { client, status, date } = req.query;
    let query = {};
    if (client) query.client = client;
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const shoots = await Shoot.find(query)
      .populate('client', 'clientName companyName email')
      .populate('order', 'packageName')
      .populate('creator', 'name photo phone availability')
      .populate('shootManager', 'name email')
      .populate('approvedScripts', 'title videoNumber')
      .sort({ date: 1 });

    res.json({ success: true, count: shoots.length, shoots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShootById = async (req, res) => {
  try {
    const shoot = await Shoot.findById(req.params.id)
      .populate('client')
      .populate('order')
      .populate('creator')
      .populate('shootManager')
      .populate('approvedScripts');

    if (!shoot) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    res.json({ success: true, shoot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createShoot = async (req, res) => {
  try {
    const { client, order, date, time, location, creator, cameraman, shootManager, shootingAssistant, approvedScripts, specialNotes } = req.body;

    // Check creator booking conflicts
    const activeShootConflict = await Shoot.findOne({
      creator,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
      status: { $in: ['Scheduled', 'Confirmed', 'In Progress'] },
    });

    if (activeShootConflict) {
      return res.status(400).json({
        success: false,
        message: 'Creator is already booked for another shoot on this date!',
      });
    }

    const shoot = await Shoot.create({
      client,
      order,
      date,
      time: time || '10:00 AM',
      location,
      creator,
      cameraman: cameraman || 'In-house Tech',
      shootManager: shootManager || req.user._id,
      shootingAssistant,
      approvedScripts: approvedScripts || [],
      specialNotes,
      status: 'Scheduled',
    });

    // Update Creator active shoot counter & availability
    await Creator.findByIdAndUpdate(creator, {
      $inc: { activeShootsCount: 1 },
      availability: 'Booked',
    });

    await logActivity(req, 'CREATE_SHOOT', 'Shoot', shoot._id, `Scheduled shoot at ${location} for ${date}`);
    await notify({
      roleTarget: 'ALL',
      title: 'New Shoot Scheduled',
      message: `Shoot scheduled at ${location} on ${new Date(date).toLocaleDateString()}`,
      type: 'info',
      link: `/shoots/${shoot._id}`,
    });

    res.status(201).json({ success: true, shoot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateShoot = async (req, res) => {
  try {
    const shoot = await Shoot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('creator client order');

    if (!shoot) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    // Auto update creator status if shoot finished
    if (['Completed', 'Cancelled'].includes(shoot.status)) {
      await Creator.findByIdAndUpdate(shoot.creator, {
        $inc: { activeShootsCount: -1 },
        availability: 'Available',
      });
    }

    await logActivity(req, 'UPDATE_SHOOT', 'Shoot', shoot._id, `Updated shoot status to ${shoot.status}`);

    res.json({ success: true, shoot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateChecklists = async (req, res) => {
  try {
    const { preShootChecklist, postShootVerification } = req.body;
    const shoot = await Shoot.findById(req.params.id);

    if (!shoot) {
      return res.status(404).json({ success: false, message: 'Shoot not found' });
    }

    if (preShootChecklist) {
      shoot.preShootChecklist = { ...shoot.preShootChecklist, ...preShootChecklist };
    }
    if (postShootVerification) {
      shoot.postShootVerification = { ...shoot.postShootVerification, ...postShootVerification };

      // If footage uploaded & verified, automatically spawn raw video card if not already created
      if (postShootVerification.footageUploaded && postShootVerification.rawFileVerified) {
        shoot.status = 'Completed';
      }
    }

    await shoot.save();

    await logActivity(req, 'UPDATE_SHOOT_CHECKLIST', 'Shoot', shoot._id, `Updated shoot checklists`);

    res.json({ success: true, shoot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShoots,
  getShootById,
  createShoot,
  updateShoot,
  updateChecklists,
};
