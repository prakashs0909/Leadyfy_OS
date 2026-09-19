const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/scripts', require('./routes/scriptRoutes'));
app.use('/api/creators', require('./routes/creatorRoutes'));
app.use('/api/shoots', require('./routes/shootRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/payouts', require('./routes/payoutRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'LEADYFY OS API Server', time: new Date() });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LEADYFY OS] Backend API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
