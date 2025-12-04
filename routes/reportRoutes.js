// backend/routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/auth");
const { generateReport } = require("../services/aiService");

// 🔐 Apply Authentication Middleware
router.use(authMiddleware);

/* ====================== GENERATE REPORT ====================== */
router.post("/generate", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id, completed: true });

    if (!quizzes || quizzes.length < 5) {
      return res.status(400).json({
        error: "⚠ Please complete all quizzes before generating report!",
      });
    }

    const report = await Report.create({
      userId: req.user.id,
      title: "Generating your Career Report...",
      status: "processing"
    });

    const quizAnswers = quizzes.map(q => ({
      type: q.type,
      responses: Object.values(q.responses?.[0] || {})
    }));

    generateReport(req.user, quizAnswers).then(async (reportData) => {
      await Report.findByIdAndUpdate(report._id, {
        ...reportData,
        quizAnswers,
        title: "AI Generated Career Report",
        status: "ready"
      });
    });

    res.status(202).json({ reportId: report._id });

  } catch (err) {
    console.error("Report Generation Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* ====================== GET ALL USER REPORTS ====================== */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (err) {
    console.error("Fetch Reports Error:", err);
    res.status(500).json({ error: "❌ Failed to fetch reports" });
  }
});

/* ====================== GET SINGLE REPORT ====================== */
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({ error: "⚠ Report not found" });
    }

    res.json(report);
  } catch (err) {
    console.error("Single Report Fetch Error:", err);
    res.status(500).json({ error: "❌ Failed to fetch report" });
  }
});

/* ====================== DELETE REPORT PERMANENTLY ====================== */
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({ error: "⚠ Report not found" });
    }

    res.json({ message: "🗑 Report deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "❌ Failed to delete report" });
  }
});

module.exports = router;
