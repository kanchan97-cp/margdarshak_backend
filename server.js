// server.js (backend root)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizzes");
const reportRoutes = require("./routes/reportRoutes"); // ✅ correct file
const chatRoutes = require("./routes/chat");
const authMiddleware = require("./middleware/auth");

const app = express();

// ✅ Proper CORS – DELETE allowed
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("Error connecting to Database ❌", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", authMiddleware, quizRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/reports", reportRoutes); // ✅ This is important

// ✅ Default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
