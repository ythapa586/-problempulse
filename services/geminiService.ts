
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, SolutionEvaluation, Stakeholder } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function simplifyProblem(rawText: string): Promise<Partial<Problem>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze and simplify this problem description into a structured format. Include a credibility analysis and suggest 3 stakeholders who should act: ${rawText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          category: { type: Type.STRING },
          severity: { type: Type.STRING },
          credibility: { type: Type.STRING, description: 'Verified, Partially Verified, or Unverified' },
          credibilityScore: { type: Type.NUMBER },
          rootCause: { type: Type.STRING },
          whoIsAffected: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
          affectedPopulation: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          stakeholders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                role: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "summary", "category", "severity", "credibility", "credibilityScore", "rootCause", "whoIsAffected", "whyItMatters", "affectedPopulation", "stakeholders"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {};
  }
}

export async function evaluateSolution(problem: Problem, solutionDescription: string): Promise<SolutionEvaluation> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate this solution for the given problem:
    Problem: ${problem.title}
    Solution: ${solutionDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feasibility: { type: Type.NUMBER, description: 'Score 0-100' },
          cost: { type: Type.NUMBER, description: 'Score 0-100 (100 is highly affordable)' },
          timeToImplement: { type: Type.STRING },
          socialImpact: { type: Type.NUMBER, description: 'Score 0-100' },
          overallScore: { type: Type.NUMBER, description: 'Weighted average' }
        },
        required: ["feasibility", "cost", "timeToImplement", "socialImpact", "overallScore"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { feasibility: 50, cost: 50, timeToImplement: "Unknown", socialImpact: 50, overallScore: 50 };
  }
}

export async function generateSolutions(problem: Problem): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 innovative solutions for: ${problem.title}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          solutions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["solutions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.solutions;
  } catch (e) {
    return ["Community awareness", "Local policy change", "Tech innovation"];
  }
}
