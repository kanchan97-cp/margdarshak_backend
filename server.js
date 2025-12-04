require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const reportRoutes = require('./routes/reports');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected 🚀'))
  .catch((err) => console.log('Error connecting to Database ❌', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', authMiddleware, quizRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Always listen on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

