const Expense = require('../models/Expense');
const { logActivity } = require('../utils/logger');

const getExpenses = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;

    const expenses = await Expense.find(query).populate('user', 'name email').sort({ date: -1 });
    res.json({ success: true, count: expenses.length, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { category, amount, date, receipt, notes } = req.body;

    const expense = await Expense.create({
      category,
      amount: Number(amount),
      user: req.user._id,
      userName: req.user.name,
      date: date || new Date(),
      receipt,
      notes,
    });

    await logActivity(req, 'CREATE_EXPENSE', 'Expense', expense._id, `Recorded agency expense of $${amount} (${category})`);

    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getExpenses, createExpense };
