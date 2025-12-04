const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authMiddleware = require("../middleware/auth");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert AI Career Mentor." },
        { role: "user", content: userMessage }
      ],
      max_tokens: 200
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (err) {
    console.error("Chat AI ERROR:", err);
    res.status(500).json({ error: "Chat AI Failed" });
  }
});

module.exports = router;
