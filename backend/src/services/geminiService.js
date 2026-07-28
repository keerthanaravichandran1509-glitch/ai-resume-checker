const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const ai = env.geminiApiKey
  ? new GoogleGenAI({ apiKey: env.geminiApiKey })
  : null;

const responseSchema = {
  type: "object",
  properties: {
    atsScore: { type: "number" },
    scoreBreakdown: {
      type: "object",
      properties: {
        formatting: { type: "number" },
        keywords: { type: "number" },
        impact: { type: "number" },
        clarity: { type: "number" },
      },
      required: ["formatting", "keywords", "impact", "clarity"],
    },
    issues: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    bulletRewrites: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          rewritten: { type: "string" },
        },
        required: ["original", "rewritten"],
      },
    },
    keywordsPresent: { type: "array", items: { type: "string" } },
    keywordsMissing: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
  required: [
    "atsScore",
    "scoreBreakdown",
    "issues",
    "strengths",
    "bulletRewrites",
    "keywordsPresent",
    "keywordsMissing",
    "summary",
  ],
};

const analysisValidator = z.object({
  atsScore: z.number(),
  scoreBreakdown: z.object({
    formatting: z.number(),
    keywords: z.number(),
    impact: z.number(),
    clarity: z.number(),
  }),
  issues: z.array(z.string()),
  strengths: z.array(z.string()),
  bulletRewrites: z.array(
    z.object({
      original: z.string(),
      rewritten: z.string(),
    })
  ),
  keywordsPresent: z.array(z.string()),
  keywordsMissing: z.array(z.string()),
  summary: z.string(),
});

async function analyzeResume(resumeText, targetRole) {
  if (!ai) throw ApiError.badRequest("Gemini API key not configured");

  const prompt = `You are an ATS resume reviewer. Analyze the following resume${
    targetRole ? ` for the target role: ${targetRole}` : ""
  }. Return a JSON object matching the required schema with an ATS score out of 100, a score breakdown, issues, strengths, bullet point rewrite suggestions, present keywords, missing keywords, and a short summary.

Resume text:
${resumeText}`;

  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const raw = response.text;
  const parsed = JSON.parse(raw);
  const result = analysisValidator.parse(parsed);

  return result;
}

module.exports = { analyzeResume };