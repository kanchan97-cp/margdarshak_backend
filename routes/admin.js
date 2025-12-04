const express = require("express");
const Quiz = require("../models/Quiz");
const User = require("../models/User");

const router = express.Router();

// Admin — Get all quizzes with user details
router.get("/quizzes", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const quizzes = await Quiz.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (err) {
    console.error("Admin Fetch Quizzes Error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Admin — Search quizzes by type with pagination
router.get("/quizzes/search", async (req, res) => {
  try {
    const { type = "", page = 1 } = req.query;

    const quizzes = await Quiz.find({
      type: { $regex: type, $options: "i" } // case-insensitive search
    })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("userId", "name email role");

    res.json(quizzes);
  } catch (err) {
    console.error("Admin Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
