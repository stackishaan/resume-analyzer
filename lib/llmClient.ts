import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  bestFitRoles: string[];
}

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyst and career coach with 15+ years of experience. 
Analyze the provided resume text for the specified job role and company, then return a JSON object with actionable, specific feedback.`;

function buildPrompt(resumeText: string, company: string, role: string): string {
  // Truncate resume to avoid token limits (~3000 chars should be enough)
  const truncated = resumeText.slice(0, 3500);

  return `${SYSTEM_PROMPT}

Resume Text:
"""
${truncated}
"""

Target Company: ${company}
Target Role: ${role}

Analyze this resume and respond ONLY with a valid JSON object (no markdown, no backticks, no extra text) in this exact format:
{
  "strengths": [
    "Specific strength 1 from the resume",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "weaknesses": [
    "Specific gap or weakness 1",
    "Specific gap or weakness 2",
    "Specific gap or weakness 3"
  ],
  "suggestions": [
    "Concrete, actionable improvement 1 (be specific)",
    "Concrete, actionable improvement 2",
    "Concrete, actionable improvement 3",
    "Concrete, actionable improvement 4",
    "Concrete, actionable improvement 5"
  ],
  "bestFitRoles": [
    "Best matching job title 1",
    "Best matching job title 2",
    "Best matching job title 3"
  ]
}

Rules:
- Strengths must be specific to THIS resume, not generic advice
- Weaknesses must be relevant to the ${company} ${role} position
- Suggestions must be concrete actions the candidate can take immediately
- bestFitRoles must be real industry job titles that match the resume content
- Return ONLY the JSON, nothing else`;
}

export async function analyzWithLLM(
  resumeText: string,
  company: string,
  role: string
): Promise<LLMAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY not set. Returning mock analysis.');
    return getMockAnalysis(company, role);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const prompt = buildPrompt(resumeText, company, role);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any accidental markdown code fences
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as LLMAnalysis;

    // Validate structure
    if (!parsed.strengths || !parsed.weaknesses || !parsed.suggestions || !parsed.bestFitRoles) {
      throw new Error('Invalid LLM response structure');
    }

    return parsed;
  } catch (err) {
    console.error('LLM analysis failed:', err);
    // Fallback to mock data so the app still works
    return getMockAnalysis(company, role);
  }
}

function getMockAnalysis(company: string, role: string): LLMAnalysis {
  return {
    strengths: [
      'Resume demonstrates relevant technical skills for the target role',
      'Work experience section shows progressive responsibility',
      'Educational background aligns with industry requirements',
    ],
    weaknesses: [
      `Resume lacks specific keywords valued by ${company} recruiters`,
      `Missing quantifiable achievements and impact metrics for ${role} position`,
      'Summary/objective section could be more targeted to this specific role',
    ],
    suggestions: [
      `Add quantifiable metrics to your achievements (e.g., "Improved performance by 30%" or "Managed a team of 5 engineers")`,
      `Include ${company}-specific technologies and tools mentioned in ${role} job descriptions`,
      'Rewrite your professional summary to directly address the target role requirements',
      'Add a dedicated Technical Skills section with proficiency levels if not present',
      'Include relevant certifications, courses, or side projects that demonstrate initiative',
    ],
    bestFitRoles: [role, 'Software Developer', 'Technical Analyst'],
  };
}
