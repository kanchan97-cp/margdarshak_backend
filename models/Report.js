const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Career Report",
    },

    // Basic: keep careers compatible with your UI
    careers: [
      {
        career: String,
        reason: String,
        roadmap: [String],
      }
    ],

    // Store quiz details if needed
    quizAnswers: {
      type: Array,
      default: [],
    },

    // Compatible with both string and array formats
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false, // 💥 Accept any extra fields AI sends (future proof)
  }
);

module.exports = mongoose.model("Report", ReportSchema);
