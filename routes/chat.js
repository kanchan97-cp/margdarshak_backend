const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { generateChatResponse } = require("../services/aiService");

// Apply auth middleware
router.use(authMiddleware);

/* ====================== CHAT WITH AI ====================== */
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const aiResponse = await generateChatResponse(message);
        res.json({ reply: aiResponse });
    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
