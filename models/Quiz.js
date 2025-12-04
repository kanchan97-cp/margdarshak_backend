const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  questions: { type: Array, default: [] },
  responses: { type: Array, default: [] },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Unique constraint like Prisma upsert `userId + type`
quizSchema.index({ userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Quiz", quizSchema);
