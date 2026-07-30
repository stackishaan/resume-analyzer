import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/parseResume';
import { scoreResume } from '@/lib/atsScorer';
import { analyzWithLLM } from '@/lib/llmClient';
import { COMPANIES, ROLES, Company, Role } from '@/lib/keywords';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const company = formData.get('company') as string | null;
    const role = formData.get('role') as string | null;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    if (!company || !COMPANIES.includes(company as Company)) {
      return NextResponse.json({ error: 'Invalid or missing company.' }, { status: 400 });
    }
    if (!role || !ROLES.includes(role as Role)) {
      return NextResponse.json({ error: 'Invalid or missing role.' }, { status: 400 });
    }

    const filename = file.name;
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      return NextResponse.json({ error: 'Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    // File size check: 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB.' }, { status: 400 });
    }

    // ── Parse Resume ────────────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parseResume(buffer, filename);

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from the resume. Please ensure it is not image-based or encrypted.' },
        { status: 422 }
      );
    }

    // ── ATS Scoring ─────────────────────────────────────────────────────────
    const atsResult = scoreResume(resumeText, company as Company, role as Role);

    // ── LLM Analysis ────────────────────────────────────────────────────────
    const llmAnalysis = await analyzWithLLM(resumeText, company, role);

    // ── Return Combined Result ───────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      atsScore: atsResult.totalScore,
      breakdown: atsResult.breakdown,
      foundKeywords: atsResult.foundKeywords.slice(0, 20),
      missingKeywords: atsResult.missingKeywords.slice(0, 15),
      sectionsFound: atsResult.sectionsFound,
      sectionsMissing: atsResult.sectionsMissing,
      wordCount: atsResult.wordCount,
      hasBullets: atsResult.hasBullets,
      strengths: llmAnalysis.strengths,
      weaknesses: llmAnalysis.weaknesses,
      suggestions: llmAnalysis.suggestions,
      bestFitRoles: llmAnalysis.bestFitRoles,
    });
  } catch (err: unknown) {
    console.error('Analyze API error:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
