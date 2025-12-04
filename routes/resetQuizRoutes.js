const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const auth = require("../middleware/auth");

// Reset a quiz by type
router.patch("/:type/reset", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ userId: req.user.id, type: req.params.type });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.completed = false;
    quiz.responses = {}; // clear answers
    await quiz.save();

    res.json({ message: "Quiz restarted successfully" });
  } catch (err) {
    console.error("Reset quiz error:", err);
    res.status(500).json({ error: "Failed to restart quiz" });
  }
});

module.exports = router;
