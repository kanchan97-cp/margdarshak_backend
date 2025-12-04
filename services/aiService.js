const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateReport = async (user, quizAnswers) => {
  try {
    const prompt = `
You are an expert Indian Career Counselor.
Generate a detailed and realistic Career Report based on student's quiz responses.

User Name: ${user.name}
Quiz Results (Interest + Aptitude + Personality + Orientation + EQ):
${JSON.stringify(quizAnswers, null, 2)}

STRICTLY return output in this JSON format only:

{
  "title": "AI Generated Career Report",
  "topCareers": [
    {
      "careerName": "Career suggestion",
      "whyFit": "Why student is suitable"
    }
  ],
  "roadmap": [
    {
      "step": "What student must do",
      "timeline": "Time duration (1 month / 6 months / 1 year)"
    }
  ],
  "educationPath": [
    "Degree names suitable to career"
  ],
  "entranceExams": [
    "Exam options if relevant"
  ],
  "softSkills": [
    "Skills the student must improve"
  ],
  "conclusion": "Motivational customized summary"
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (err) {
    console.error("🔥 AI ERROR:", err);
    return {
      title: "Career Report",
      topCareers: [],
      roadmap: [],
      educationPath: [],
      entranceExams: [],
      softSkills: [],
      conclusion: "AI failed to generate report."
    };
  }
};
