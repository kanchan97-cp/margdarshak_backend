const express = require("express");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Apply auth middleware to all quiz routes
router.use(authMiddleware);

// Get quizzes of logged-in user
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id });
    res.json(quizzes);
  } catch (err) {
    console.error("Get Quiz Error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Create or update quiz (upsert logic)
router.post("/", async (req, res) => {
  try {
    const { type, responses } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { userId: req.user.id, type },
      { responses, completed: true },
      { new: true, upsert: true }
    );

    res.json(quiz);
  } catch (err) {
    console.error("Save Quiz Error:", err);
    res.status(500).json({ error: "Failed to save quiz" });
  }
});

module.exports = router;
