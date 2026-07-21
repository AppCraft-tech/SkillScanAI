import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance = null;
let modelInstance = null;

function getModel() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY is missing. Please set it in your .env file and restart the development server.");
    }
    if (!genAIInstance) {
        genAIInstance = new GoogleGenerativeAI(apiKey);
        modelInstance = genAIInstance.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
    }
    return modelInstance;
}

export async function generateQuestion(role = "General Software Engineer", previousQuestions = [], isFirstQuestion = false) {
    if (isFirstQuestion) {
        return "Tell me about yourself, your background, and why you are interested in this role.";
    }

    const topics = [
        "behavioral", "technical", "situational", "past experience", 
        "problem-solving", "communication", "leadership", "adaptability",
        "industry knowledge", "conflict resolution", "time management"
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    let excludeContext = "";
    if (previousQuestions.length > 0) {
        excludeContext = `
Do NOT ask any of the following questions (or variations of them):
${previousQuestions.map(q => `- ${q}`).join('\n')}
`;
    }

    const prompt = `
You are an expert HR and technical interviewer.

Generate ONE unique and creative professional interview question for a ${role} candidate.

Focus this specific question on: ${randomTopic}.
${excludeContext}

Rules:
- Ensure the question is different from standard generic questions.
- Return only the question.
- No numbering or prefixes.
- No explanation.
- Maximum 25 words.
- Use this random seed to ensure uniqueness: ${Math.random()}
`;

    const result = await getModel().generateContent(prompt);

    return result.response.text();

}

export async function evaluateAnswer(question, answer) {

    const prompt = `
You are an expert HR Interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer professionally.

Return ONLY in this format:

Overall Score: X/10

Confidence: X%

Communication: X%

Technical Knowledge: X%

Strengths:
• ...

Weaknesses:
• ...

Suggestions:
• ...
`;

    const result = await getModel().generateContent(prompt);

    return result.response.text();

}