const Order = require('../models/Order');
const Video = require('../models/Video');
const { logActivity, notify } = require('../utils/logger');

const getOrders = async (req, res) => {
  try {
    const { client, status } = req.query;
    let query = {};
    if (client) query.client = client;
    if (status) query.status = status;

    // Filter by client if user role is CLIENT
    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const orders = await Order.find(query)
      .populate('client', 'clientName companyName email brandAssets')
      .populate('assignedTeam', 'name email role')
      .sort({ createdAt: -1 });

    // Attach live video production quota stats to each order
    const ordersWithStats = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        const videos = await Video.find({ order: order._id });
        const orderedVideos = order.contractedVideoCount || 10;
        const assignedVideos = videos.length;
        const completedVideos = videos.filter((v) =>
          ['Final Approved', 'Delivered'].includes(v.status)
        ).length;
        const deliveredVideos = videos.filter((v) => v.status === 'Delivered').length;
        const remainingQuota = Math.max(0, orderedVideos - deliveredVideos);

        return {
          ...orderObj,
          quotaStats: {
            orderedVideos,
            assignedVideos,
            completedVideos,
            deliveredVideos,
            remainingQuota,
          },
        };
      })
    );

    res.json({ success: true, count: ordersWithStats.length, orders: ordersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client')
      .populate('assignedTeam', 'name email role');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check CLIENT role restriction
    if (
      req.user.role === 'CLIENT' &&
      req.user.clientId &&
      order.client._id.toString() !== req.user.clientId.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    const videos = await Video.find({ order: order._id }).populate('script creator assignedEditor');
    const orderedVideos = order.contractedVideoCount || 10;
    const assignedVideos = videos.length;
    const completedVideos = videos.filter((v) =>
      ['Final Approved', 'Delivered'].includes(v.status)
    ).length;
    const deliveredVideos = videos.filter((v) => v.status === 'Delivered').length;
    const remainingQuota = Math.max(0, orderedVideos - deliveredVideos);

    res.json({
      success: true,
      order,
      quotaStats: {
        orderedVideos,
        assignedVideos,
        completedVideos,
        deliveredVideos,
        remainingQuota,
      },
      videos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { client, packageName, contractedVideoCount, pricing, gstTax, startDate, dueDate, assignedTeam } = req.body;

    const pricingNum = Number(pricing) || 0;
    const gstTaxNum = Number(gstTax) || 0;
    const totalInvoiceAmount = pricingNum + gstTaxNum;

    const order = await Order.create({
      client,
      packageName,
      contractedVideoCount: Number(contractedVideoCount) || 10,
      pricing: pricingNum,
      gstTax: gstTaxNum,
      totalInvoiceAmount,
      amountReceived: 0,
      outstandingBalance: totalInvoiceAmount,
      startDate,
      dueDate,
      assignedTeam,
      status: 'New',
    });

    await logActivity(req, 'CREATE_ORDER', 'Order', order._id, `Created order package ${packageName}`);
    await notify({
      roleTarget: 'ALL',
      title: 'New Order Created',
      message: `Package ${packageName} created with quota of ${order.contractedVideoCount} videos.`,
      type: 'info',
      link: `/orders/${order._id}`,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.body.pricing !== undefined || req.body.gstTax !== undefined) {
      const pricingNum = req.body.pricing !== undefined ? Number(req.body.pricing) : order.pricing;
      const gstTaxNum = req.body.gstTax !== undefined ? Number(req.body.gstTax) : order.gstTax;
      req.body.totalInvoiceAmount = pricingNum + gstTaxNum;
      req.body.outstandingBalance = req.body.totalInvoiceAmount - (req.body.amountReceived || order.amountReceived);
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('client');

    await logActivity(req, 'UPDATE_ORDER', 'Order', order._id, `Updated order package ${updatedOrder.packageName}`);

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
};
