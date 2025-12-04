const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema({
  career: String,
  reason: String,
  roadmap: [String]
});

const AnswerSchema = new mongoose.Schema({
  type: String,
  responses: [String]
});

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  careers: [CareerSchema],
  quizAnswers: [AnswerSchema],
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
