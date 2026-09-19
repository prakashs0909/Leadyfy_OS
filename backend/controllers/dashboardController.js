const Client = require('../models/Client');
const Order = require('../models/Order');
const Script = require('../models/Script');
const Shoot = require('../models/Shoot');
const Video = require('../models/Video');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const CreatorPayout = require('../models/CreatorPayout');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const getDashboardData = async (req, res) => {
  try {
    const role = req.user.role;

    // Filter for Client Role
    if (role === 'CLIENT' && req.user.clientId) {
      const clientId = req.user.clientId;
      const clientObj = await Client.findById(clientId);
      const orders = await Order.find({ client: clientId });
      const scripts = await Script.find({ client: clientId });
      const videos = await Video.find({ client: clientId });
      const payments = await Payment.find({ client: clientId });

      const totalVideosOrdered = orders.reduce((sum, o) => sum + (o.contractedVideoCount || 10), 0);
      const videosDelivered = videos.filter((v) => v.status === 'Delivered').length;
      const pendingApprovals = videos.filter((v) => v.status === 'Client Review').length + scripts.filter((s) => s.status === 'Sent to Client').length;

      return res.json({
        success: true,
        role: 'CLIENT',
        clientProfile: clientObj,
        kpis: {
          activeOrders: orders.filter((o) => o.status === 'In Production').length,
          totalVideosOrdered,
          videosDelivered,
          pendingApprovals,
          outstandingBalance: orders.reduce((sum, o) => sum + (o.outstandingBalance || 0), 0),
        },
        orders,
        scripts,
        videos,
        payments,
      });
    }

    // Owner / Admin / Employee Dashboard Calculations
    const totalActiveClients = await Client.countDocuments({ status: 'Active' });
    const newClients = await Client.countDocuments({ status: 'New' });
    const activeOrders = await Order.countDocuments({ status: { $in: ['New', 'Onboarding', 'In Production'] } });
    const pendingScripts = await Script.countDocuments({ status: { $in: ['Draft', 'Assigned', 'In Review', 'Revision Required'] } });
    const upcomingShoots = await Shoot.countDocuments({ status: { $in: ['Scheduled', 'Confirmed'] } });
    const videosInProduction = await Video.countDocuments({ status: { $ne: 'Delivered' } });
    const pendingApprovals = await Video.countDocuments({ status: 'Client Review' });
    const deliveredVideos = await Video.countDocuments({ status: 'Delivered' });

    // Financial calculations
    const allPayments = await Payment.find();
    const allExpenses = await Expense.find();
    const allPayouts = await CreatorPayout.find();
    const allOrders = await Order.find();

    const monthlyRevenue = allPayments.reduce((sum, p) => sum + (p.amountReceived || 0), 0);
    const totalReceivables = allOrders.reduce((sum, o) => sum + (o.outstandingBalance || 0), 0);
    const monthlyExpenses = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const creatorPayouts = allPayouts.reduce((sum, p) => sum + (p.totalPayout || 0), 0);

    // Formula: Net Profit = Revenue - Expenses - Creator Payouts
    const estimatedNetProfit = monthlyRevenue - monthlyExpenses - creatorPayouts;

    // Production pipeline breakdown across the 9 stages
    const pipelineStages = [
      'Script Approved',
      'Shoot Pending',
      'Raw Footage Received',
      'Video Editing',
      'Internal QA',
      'Client Review',
      'Revision',
      'Final Approved',
      'Delivered',
    ];

    const pipelineBreakdown = await Promise.all(
      pipelineStages.map(async (stage) => ({
        stage,
        count: await Video.countDocuments({ status: stage }),
      }))
    );

    // Today's shoots
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysShoots = await Shoot.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('client creator shootManager');

    // Urgent tasks
    const urgentTasks = await Task.find({
      $or: [{ priority: 'Urgent' }, { status: { $ne: 'Done' } }],
    })
      .populate('assignee', 'name avatar')
      .limit(6);

    // Pending client approvals
    const pendingClientApprovals = await Video.find({ status: 'Client Review' })
      .populate('client creator assignedEditor')
      .limit(6);

    // Recent activity feed
    const recentActivity = await ActivityLog.find().sort({ timestamp: -1 }).limit(8);

    // Revenue & Production Chart Mock/Aggregated Monthly Data
    const monthlyRevenueData = [
      { month: 'May', revenue: 14500, expenses: 4200, payouts: 2100, profit: 8200 },
      { month: 'Jun', revenue: 18200, expenses: 4800, payouts: 2600, profit: 10800 },
      { month: 'Jul', revenue: 21000, expenses: 5100, payouts: 3100, profit: 12800 },
      { month: 'Aug', revenue: 24500, expenses: 5800, payouts: 3400, profit: 15300 },
      { month: 'Sep', revenue: monthlyRevenue, expenses: monthlyExpenses, payouts: creatorPayouts, profit: estimatedNetProfit },
    ];

    res.json({
      success: true,
      kpis: {
        totalActiveClients,
        newClients,
        activeOrders,
        pendingScripts,
        upcomingShoots,
        videosInProduction,
        pendingApprovals,
        deliveredVideos,
        totalReceivables,
        monthlyRevenue,
        monthlyExpenses,
        creatorPayouts,
        estimatedNetProfit,
      },
      pipelineBreakdown,
      widgets: {
        todaysShoots,
        urgentTasks,
        pendingClientApprovals,
        recentActivity,
        monthlyRevenueData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
