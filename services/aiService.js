const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateReport = async (user, quizAnswers) => {
  try {
    const prompt = `
Analyze the following quiz responses and generate a personalized career report.

User: ${user.name}
Quiz Data: ${JSON.stringify(quizAnswers)}

Respond ONLY in JSON with this structure:

{
  "topCareers": [
    {
      "careerName": "string",
      "whyFit": "string"
    }
  ],
  "roadmap": [
    {
      "step": "string",
      "timeline": "string"
    }
  ],
  "educationPath": ["string"],
  "entranceExams": ["string"],
  "softSkills": ["string"],
  "conclusion": "string"
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a senior career counselor AI." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }
    });

    const reportJson = JSON.parse(completion.choices[0].message.content);
    console.log("📌 AI Report Generated Successfully!");
    return reportJson;

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);

    if (error.response) {
      const errText = await error.response.text();
      console.error("🔍 AI RESPONSE BODY:", errText);
    }

    return {
      topCareers: [],
      roadmap: [],
      educationPath: [],
      entranceExams: [],
      softSkills: [],
      conclusion: "AI failed to generate personalized analysis."
    };
  }
};
