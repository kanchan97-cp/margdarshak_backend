const express = require("express");
const router = express.Router();  // <-- THIS was missing

const Quiz = require("../models/Quiz");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/auth");

// Apply auth middleware
router.use(authMiddleware);

/* ====================== GENERATE REPORT ====================== */
router.post("/generate", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id, completed: true });

    if (quizzes.length < 5) {
      return res.status(400).json({
        error: "Please complete all 5 quizzes to generate a comprehensive report."
      });
    }

    const quizAnswers = quizzes.map(q => ({
      type: q.type,
      responses: Object.values(q.responses[0] || {})
    }));

    const careers = [
      {
        career: "Software Developer",
        reason: "Strong analytical and interest in technology",
        roadmap: [
          "Learn JavaScript/Core Programming",
          "Create Projects & Upload on GitHub",
          "Apply internships and coding contests"
        ]
      },
      {
        career: "UI/UX Designer",
        reason: "High creative & visual thinking traits detected",
        roadmap: [
          "Learn UI/UX Tools (Figma, Canva)",
          "Build portfolio case studies",
          "Freelance internships for real products"
        ]
      }
    ];

    const report = await Report.create({
      userId: req.user.id,
      title: `Career Report - ${new Date().toLocaleDateString()}`,
      careers,
      roadmap: "Choose based on your personal preference",
      quizAnswers
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
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
