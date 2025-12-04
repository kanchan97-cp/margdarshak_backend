const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ===========================================================
   🚀 Generate AI Career Report
   =========================================================== */
exports.generateReport = async (user, quizAnswers) => {
  try {
    const prompt = `
You are an expert Indian Career Counselor.
Analyze the student's quiz answers and generate a meaningful and actionable career guidance report.

User Name: ${user.name}
Quiz Results:
${JSON.stringify(quizAnswers, null, 2)}

📌 STRICT JSON OUTPUT FORMAT ONLY:

{
  "title": "AI Generated Career Report",
  "topCareers": [
    {
      "careerName": "",
      "whyFit": ""
    }
  ],
  "roadmap": [
    {
      "step": "",
      "timeline": ""
    }
  ],
  "educationPath": [""],
  "entranceExams": [""],
  "softSkills": [""],
  "conclusion": ""
}
`;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a professional career analyst." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1200
    });

    return JSON.parse(res.choices[0].message.content);

  } catch (err) {
    console.error("🔥 AI REPORT ERROR:", err);
    return {
      title: "AI Generated Career Report",
      topCareers: [],
      roadmap: [],
      educationPath: [],
      entranceExams: [],
      softSkills: [],
      conclusion: "AI failed to generate personalized analysis."
    };
  }
};

/* ===========================================================
   💬 AI Chat Response
   =========================================================== */
exports.generateChatResponse = async (message) => {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly AI career counselor. Provide clear, short advice." },
        { role: "user", content: message }
      ],
      max_tokens: 300
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error("🔥 AI CHAT ERROR:", err);
    return "Sorry, something went wrong. Please try again!";
  }
};
