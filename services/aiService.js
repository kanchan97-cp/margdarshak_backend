const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateReport = async (user, quizAnswers) => {
  try {
    const prompt = `
You are an AI Career Counselor. 
Analyze quiz responses and generate a detailed career guidance report.

User: ${user.name}
Quiz Data: ${JSON.stringify(quizAnswers)}

Respond STRICTLY in JSON format with this structure:

{
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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a professional career analyst." },
        { role: "user", content: prompt }
      ]
    });

    const reportJson = JSON.parse(completion.choices[0].message.content);
    console.log("AI Report Generated:", reportJson);

    return reportJson;

  } catch (err) {
    console.error("AI ERROR:", err);
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
