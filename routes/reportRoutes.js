// backend/routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const Report = require("../models/Report");
const { generateReport } = require("../services/aiService");

/* ====================== GENERATE REPORT ====================== */
router.post("/generate", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id, completed: true });

    if (!quizzes || quizzes.length === 0) {
      return res.status(400).json({
        error: "Please complete at least one quiz to generate a report.",
      });
    }

    const quizAnswers = quizzes.map((q) => ({
      type: q.type,
      responses: Object.values(q.responses?.[0] || {}),
    }));

    const reportData = await generateReport(req.user, quizAnswers);

    const report = await Report.create({
      userId: req.user.id,
      ...reportData,
      quizAnswers,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("Report Generation Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ====================== GET USER REPORTS ====================== */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (err) {
    console.error("Fetch Reports Error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/* ====================== DELETE REPORT ====================== */
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /api/reports/" + req.params.id);

    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;
