'use client';

import { useState } from 'react';
import UploadForm, { AnalysisResult } from '@/components/UploadForm';
import ScoreGauge from '@/components/ScoreGauge';
import ResultsPanel from '@/components/ResultsPanel';
import JobRoles from '@/components/JobRoles';
import LoadingSpinner from '@/components/LoadingSpinner';

const FEATURES = [
  { icon: '🎯', title: 'ATS Score', desc: 'Instant ATS compatibility score out of 100' },
  { icon: '🏢', title: 'Company-Specific', desc: 'Tailored analysis for Google, Amazon, TCS & more' },
  { icon: '🤖', title: 'AI Insights', desc: 'Gemini-powered strengths, gaps & suggestions' },
  { icon: '🔑', title: 'Keyword Match', desc: 'Exact keywords recruiters are looking for' },
];

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Background layers */}
      <div className="bg-mesh" />
      <div className="bg-grid" />

      <div className="relative min-h-screen">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="relative z-10 px-6 pt-8 pb-4 max-w-6xl mx-auto">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-sm shadow-lg shadow-brand-500/30">
                📋
              </div>
              <span className="font-black text-white tracking-tight">ResumeAI</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by Gemini 1.5 Flash
            </div>
          </nav>
        </header>

        <main className="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
          {/* ── Hero Section ─────────────────────────────────────────────── */}
          {!result && !isLoading && (
            <section className="text-center pt-12 pb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6 tracking-wide">
                <span className="animate-pulse">✨</span>
                AI-Powered Resume Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4">
                Know Your{' '}
                <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ATS Score
                </span>
                <br />
                Before Recruiters Do
              </h1>

              <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                Upload your resume, select your target company and role. Get instant ATS analysis,
                keyword gaps, AI feedback, and actionable improvements in seconds.
              </p>

              {/* Feature pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-12">
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="glass-card p-3.5 text-left hover:scale-105 transition-transform duration-200"
                  >
                    <div className="text-xl mb-1">{f.icon}</div>
                    <div className="text-white text-xs font-bold mb-0.5">{f.title}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{f.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Upload Card ───────────────────────────────────────────────── */}
          {!result && (
            <div className="max-w-xl mx-auto">
              <div className="glass-card p-8 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-brand-500/30">
                    🚀
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight">Analyze Your Resume</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Upload once, get instant insights</p>
                  </div>
                </div>

                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <UploadForm
                    onResult={setResult}
                    onLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Results ────────────────────────────────────────────────────── */}
          {result && (
            <div className="space-y-8 animate-fade-in">
              {/* Results header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Analysis Complete</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Your resume has been analyzed. Here&apos;s your full report.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  id="analyze-another-btn"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-white/20 hover:text-white"
                >
                  ↩ Analyze Another
                </button>
              </div>

              {/* Score + overview */}
              <div className="glass-card p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Gauge */}
                  <div className="flex-shrink-0">
                    <ScoreGauge score={result.atsScore} />
                  </div>

                  {/* Score details */}
                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-white">Your ATS Score</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {result.atsScore >= 75
                          ? '🎉 Excellent! Your resume is highly compatible with ATS systems.'
                          : result.atsScore >= 55
                          ? '👍 Good match, but there\'s room to improve keyword coverage.'
                          : result.atsScore >= 35
                          ? '⚡ Fair match. Follow the suggestions below to significantly improve.'
                          : '🔧 Needs significant improvement. Check the action items below.'}
                      </p>
                    </div>

                    {/* Quick score pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.breakdown.map((item) => {
                        const pct = item.score / item.maxScore;
                        const color = pct >= 0.75 ? 'text-green-400 bg-green-400/10 border-green-400/20'
                          : pct >= 0.5 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                          : 'text-red-400 bg-red-400/10 border-red-400/20';
                        return (
                          <span key={item.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
                            {item.label}: {item.score}/{item.maxScore}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed results grid */}
              <ResultsPanel
                strengths={result.strengths}
                weaknesses={result.weaknesses}
                suggestions={result.suggestions}
                foundKeywords={result.foundKeywords}
                missingKeywords={result.missingKeywords}
                breakdown={result.breakdown}
                sectionsFound={result.sectionsFound}
                sectionsMissing={result.sectionsMissing}
                wordCount={result.wordCount}
              />

              {/* Best fit roles */}
              {result.bestFitRoles && result.bestFitRoles.length > 0 && (
                <JobRoles roles={result.bestFitRoles} />
              )}

              {/* Re-analyze CTA */}
              <div className="text-center pt-4">
                <button
                  onClick={handleReset}
                  className="submit-btn max-w-xs mx-auto"
                  id="try-another-btn"
                >
                  🔄 Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/5 py-6 text-center">
          <p className="text-slate-600 text-xs">
            ResumeAI • AI-Powered ATS Analysis •{' '}
            <span className="text-slate-500">Built with Next.js & Gemini</span>
          </p>
        </footer>
      </div>
    </>
  );
}
