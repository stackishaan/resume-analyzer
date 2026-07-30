import {
  Company,
  Role,
  COMPANY_KEYWORDS,
  ROLE_KEYWORDS,
  REQUIRED_SECTIONS,
  KeywordTier,
} from './keywords';

export interface SectionScore {
  label: string;
  score: number;
  maxScore: number;
}

export interface ATSResult {
  totalScore: number;
  breakdown: SectionScore[];
  foundKeywords: string[];
  missingKeywords: string[];
  sectionsFound: string[];
  sectionsMissing: string[];
  wordCount: number;
  hasBullets: boolean;
}

// ─── TF-IDF Keyword Match ─────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s\/\.#\+]/g, ' ').replace(/\s+/g, ' ').trim();
}

function computeKeywordScore(
  resumeText: string,
  tiers: KeywordTier[],
  maxPoints: number
): { score: number; found: string[]; missing: string[] } {
  const normalized = normalizeText(resumeText);

  let totalWeight = 0;
  let earnedWeight = 0;
  const found: string[] = [];
  const missing: string[] = [];

  for (const tier of tiers) {
    for (const term of tier.terms) {
      totalWeight += tier.weight;
      if (normalized.includes(term.toLowerCase())) {
        earnedWeight += tier.weight;
        found.push(term);
      } else {
        missing.push(term);
      }
    }
  }

  const ratio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
  // Apply soft cap so perfect score requires ~70%+ match
  const score = Math.round(Math.min(ratio * 1.4, 1.0) * maxPoints);
  return { score, found, missing };
}

// ─── Section Detection ────────────────────────────────────────────────────────

function detectSections(text: string): { found: string[]; missing: string[] } {
  const normalized = normalizeText(text);
  const found: string[] = [];
  const missing: string[] = [];

  const coreRequired = ['experience', 'education', 'skills'];
  const optionalSections = REQUIRED_SECTIONS.filter(s => !coreRequired.includes(s));

  for (const section of coreRequired) {
    if (normalized.includes(section)) {
      found.push(section);
    } else {
      missing.push(section);
    }
  }

  for (const section of optionalSections) {
    if (normalized.includes(section)) {
      found.push(section);
    }
  }

  return { found, missing };
}

// ─── Bullet Point Detection ───────────────────────────────────────────────────

function detectBullets(text: string): { hasBullets: boolean; bulletCount: number } {
  const bulletPatterns = /^[\s]*[•\-\*\►\▶\▸\◆\◇\○\●\✓\✔\→\⚫\★\☆\>\|]\s/gm;
  const numberedPatterns = /^[\s]*\d+[\.\)]\s/gm;
  const matches = (text.match(bulletPatterns) || []).length + (text.match(numberedPatterns) || []).length;
  return { hasBullets: matches >= 3, bulletCount: matches };
}

// ─── Word Count ───────────────────────────────────────────────────────────────

function getWordCount(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function scoreLengthCheck(wordCount: number, maxPoints: number): number {
  // Optimal: 300–700 words for a 1-page resume; 700-1200 for 2-page
  if (wordCount >= 300 && wordCount <= 1200) return maxPoints;
  if (wordCount >= 200 && wordCount < 300) return Math.round(maxPoints * 0.7);
  if (wordCount > 1200 && wordCount <= 1600) return Math.round(maxPoints * 0.8);
  if (wordCount < 200) return Math.round(maxPoints * 0.4);
  return Math.round(maxPoints * 0.5); // > 1600 words
}

// ─── Main Scorer ──────────────────────────────────────────────────────────────

export function scoreResume(
  resumeText: string,
  company: Company,
  role: Role
): ATSResult {
  const MAX_COMPANY_KW = 45;
  const MAX_ROLE_KW = 25;
  const MAX_SECTIONS = 15;
  const MAX_BULLETS = 8;
  const MAX_LENGTH = 7;

  // 1. Company keyword score
  const companyTiers = COMPANY_KEYWORDS[company];
  const companyResult = computeKeywordScore(resumeText, companyTiers, MAX_COMPANY_KW);

  // 2. Role keyword score (single tier at weight=1.0)
  const roleTerms = ROLE_KEYWORDS[role];
  const roleTiers: KeywordTier[] = [{ weight: 1.0, terms: roleTerms }];
  const roleResult = computeKeywordScore(resumeText, roleTiers, MAX_ROLE_KW);

  // 3. Section detection
  const { found: sectionsFound, missing: sectionsMissing } = detectSections(resumeText);
  // Scoring: 3 core sections worth 5 pts each = 15 pts
  const coreFound = sectionsFound.filter(s => ['experience', 'education', 'skills'].includes(s)).length;
  const sectionScore = Math.round((coreFound / 3) * MAX_SECTIONS);

  // 4. Bullet point usage
  const { hasBullets, bulletCount } = detectBullets(resumeText);
  const bulletScore = hasBullets ? MAX_BULLETS : Math.round((bulletCount / 3) * MAX_BULLETS);

  // 5. Resume length
  const wordCount = getWordCount(resumeText);
  const lengthScore = scoreLengthCheck(wordCount, MAX_LENGTH);

  const totalScore = Math.min(
    100,
    companyResult.score + roleResult.score + sectionScore + Math.min(bulletScore, MAX_BULLETS) + lengthScore
  );

  return {
    totalScore,
    breakdown: [
      { label: `${company} Keywords`, score: companyResult.score, maxScore: MAX_COMPANY_KW },
      { label: `${role} Skills`, score: roleResult.score, maxScore: MAX_ROLE_KW },
      { label: 'Section Structure', score: sectionScore, maxScore: MAX_SECTIONS },
      { label: 'Bullet Point Usage', score: Math.min(bulletScore, MAX_BULLETS), maxScore: MAX_BULLETS },
      { label: 'Resume Length', score: lengthScore, maxScore: MAX_LENGTH },
    ],
    foundKeywords: [...new Set([...companyResult.found, ...roleResult.found])],
    missingKeywords: [...new Set([...companyResult.missing.slice(0, 15), ...roleResult.missing.slice(0, 10)])],
    sectionsFound,
    sectionsMissing,
    wordCount,
    hasBullets,
  };
}

// ─── Best Fit Role Detector (rule-based fallback) ─────────────────────────────
// Used if LLM fails; computes role match scores for all roles

export function detectBestFitRoles(resumeText: string): Role[] {
  const ROLES = Object.keys(ROLE_KEYWORDS) as Role[];
  const scores: { role: Role; score: number }[] = ROLES.map(role => {
    const tiers: KeywordTier[] = [{ weight: 1.0, terms: ROLE_KEYWORDS[role] }];
    const result = computeKeywordScore(resumeText, tiers, 100);
    return { role, score: result.score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 3).map(s => s.role);
}
