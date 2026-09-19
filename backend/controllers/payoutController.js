const CreatorPayout = require('../models/CreatorPayout');
const { logActivity, notify } = require('../utils/logger');

const getPayouts = async (req, res) => {
  try {
    const { status, creator } = req.query;
    let query = {};
    if (status) query.status = status;
    if (creator) query.creator = creator;

    const payouts = await CreatorPayout.find(query)
      .populate('creator', 'name photo bankInfo contact')
      .populate('order', 'packageName')
      .sort({ paymentDate: -1 });

    res.json({ success: true, count: payouts.length, payouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayout = async (req, res) => {
  try {
    const { creator, order, video, shoot, videoCount, contractedRate, totalPayout, paymentDate, reference } = req.body;

    // Check duplicate payout prevention
    if (video || shoot) {
      const existing = await CreatorPayout.findOne({
        creator,
        $or: [{ video: video || null }, { shoot: shoot || null }],
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A payout record already exists for this video/shoot!',
        });
      }
    }

    const rate = Number(contractedRate) || 150;
    const count = Number(videoCount) || 1;
    const calcPayout = Number(totalPayout) || rate * count;

    const payout = await CreatorPayout.create({
      creator,
      order,
      video,
      shoot,
      videoCount: count,
      contractedRate: rate,
      totalPayout: calcPayout,
      paymentDate: paymentDate || new Date(),
      reference,
      status: req.body.status || 'Pending',
    });

    await logActivity(req, 'CREATE_PAYOUT', 'CreatorPayout', payout._id, `Generated creator payout of $${calcPayout}`);

    res.status(201).json({ success: true, payout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePayoutStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payout = await CreatorPayout.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('creator');

    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found' });
    }

    await logActivity(req, 'UPDATE_PAYOUT_STATUS', 'CreatorPayout', payout._id, `Payout status changed to ${status}`);

    res.json({ success: true, payout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPayouts,
  createPayout,
  updatePayoutStatus,
};
