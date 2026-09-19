const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { logActivity, notify } = require('../utils/logger');

const getPayments = async (req, res) => {
  try {
    const { client, order, status } = req.query;
    let query = {};
    if (client) query.client = client;
    if (order) query.order = order;
    if (status) query.status = status;

    if (req.user.role === 'CLIENT' && req.user.clientId) {
      query.client = req.user.clientId;
    }

    const payments = await Payment.find(query)
      .populate('client', 'clientName companyName email')
      .populate('order', 'packageName totalInvoiceAmount')
      .sort({ paymentDate: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { client, order, invoiceAmount, amountReceived, paymentDate, method, transactionRef, notes } = req.body;

    const invAmt = Number(invoiceAmount) || 0;
    const recAmt = Number(amountReceived) || 0;
    const pendingBalance = Math.max(0, invAmt - recAmt);

    let status = 'Unpaid';
    if (recAmt >= invAmt) status = 'Paid';
    else if (recAmt > 0) status = 'Partially Paid';

    const payment = await Payment.create({
      client,
      order,
      invoiceAmount: invAmt,
      amountReceived: recAmt,
      pendingBalance,
      paymentDate: paymentDate || new Date(),
      method: method || 'Bank Transfer',
      transactionRef,
      notes,
      status,
    });

    // Sync order amountReceived
    if (order) {
      const targetOrder = await Order.findById(order);
      if (targetOrder) {
        targetOrder.amountReceived = (targetOrder.amountReceived || 0) + recAmt;
        targetOrder.save();
      }
    }

    await logActivity(req, 'RECORD_PAYMENT', 'Payment', payment._id, `Recorded payment of $${recAmt} for invoice`);
    await notify({
      roleTarget: 'OWNER',
      title: 'Payment Recorded',
      message: `Received $${recAmt} payment ref #${transactionRef || payment._id}`,
      type: 'success',
      link: `/payments`,
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getPayments, createPayment };
