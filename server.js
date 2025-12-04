// backend/server.js

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
const resetQuizRoutes = require("./routes/resetQuizRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("❌ Mongo DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/quizzes", authMiddleware, quizRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/quizzes/reset", resetQuizRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🟢`)
);



