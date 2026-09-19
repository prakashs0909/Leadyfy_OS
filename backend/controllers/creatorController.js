const Creator = require('../models/Creator');
const Shoot = require('../models/Shoot');
const { logActivity } = require('../utils/logger');

const getCreators = async (req, res) => {
  try {
    const { availability, niche, search } = req.query;
    let query = {};
    if (availability) query.availability = availability;
    if (niche) query.niches = niche;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let creators = await Creator.find(query).sort({ name: 1 });

    // Sanitize sensitive bank details if role is CLIENT or lower
    if (req.user.role === 'CLIENT') {
      creators = creators.map((c) => {
        const obj = c.toObject();
        delete obj.bankInfo;
        delete obj.rates;
        delete obj.contact;
        return obj;
      });
    }

    res.json({ success: true, count: creators.length, creators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCreatorById = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    let creatorObj = creator.toObject();
    if (req.user.role === 'CLIENT') {
      delete creatorObj.bankInfo;
      delete creatorObj.rates;
      delete creatorObj.contact;
    }

    // Get active shoots
    const activeShoots = await Shoot.find({
      creator: creator._id,
      status: { $in: ['Scheduled', 'Confirmed', 'In Progress'] },
    }).populate('client order');

    res.json({ success: true, creator: creatorObj, activeShoots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCreator = async (req, res) => {
  try {
    const creator = await Creator.create(req.body);
    await logActivity(req, 'CREATE_CREATOR', 'Creator', creator._id, `Added new creator ${creator.name}`);
    res.status(201).json({ success: true, creator });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCreator = async (req, res) => {
  try {
    const creator = await Creator.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    await logActivity(req, 'UPDATE_CREATOR', 'Creator', creator._id, `Updated creator ${creator.name}`);
    res.json({ success: true, creator });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCreator = async (req, res) => {
  try {
    const creator = await Creator.findByIdAndDelete(req.params.id);
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }
    await logActivity(req, 'DELETE_CREATOR', 'Creator', creator._id, `Deleted creator ${creator.name}`);
    res.json({ success: true, message: 'Creator removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCreators,
  getCreatorById,
  createCreator,
  updateCreator,
  deleteCreator,
};
