// server.js (Fix)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizzes");
const reportRoutes = require("./routes/reportRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log("DB Error ❌", err));

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", authMiddleware, quizRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);  // ✔ Correct — only once

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
