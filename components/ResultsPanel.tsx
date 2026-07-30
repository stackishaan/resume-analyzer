'use client';

interface ResultsPanelProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  foundKeywords: string[];
  missingKeywords: string[];
  breakdown: { label: string; score: number; maxScore: number }[];
  sectionsFound: string[];
  sectionsMissing: string[];
  wordCount: number;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-slate-400 w-12 text-right">
        {value}/{max}
      </span>
    </div>
  );
}

function getBarColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.75) return 'linear-gradient(90deg, #22c55e, #16a34a)';
  if (pct >= 0.5) return 'linear-gradient(90deg, #f59e0b, #d97706)';
  return 'linear-gradient(90deg, #ef4444, #dc2626)';
}

export default function ResultsPanel({
  strengths,
  weaknesses,
  suggestions,
  foundKeywords,
  missingKeywords,
  breakdown,
  sectionsFound,
  sectionsMissing,
  wordCount,
}: ResultsPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">

      {/* Score Breakdown */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge blue">📊</span>
          Score Breakdown
        </h3>
        <div className="space-y-4 mt-4">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-300 font-medium">{item.label}</span>
              </div>
              <ProgressBar
                value={item.score}
                max={item.maxScore}
                color={getBarColor(item.score, item.maxScore)}
              />
            </div>
          ))}
        </div>

        {/* Resume stats */}
        <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-3 text-center">
          <div className="stat-chip">
            <span className="stat-value">{wordCount}</span>
            <span className="stat-label">Words</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{sectionsFound.length}</span>
            <span className="stat-label">Sections</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{foundKeywords.length}</span>
            <span className="stat-label">Keywords</span>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge green">✅</span>
          Strengths
        </h3>
        <ul className="mt-4 space-y-3">
          {strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
              <span className="text-green-400 mt-0.5 shrink-0">▸</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge red">⚠️</span>
          Areas to Improve
        </h3>
        <ul className="mt-4 space-y-3">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
              <span className="text-red-400 mt-0.5 shrink-0">▸</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Actionable Suggestions */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge purple">💡</span>
          Actionable Suggestions
        </h3>
        <ol className="mt-4 space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
              <span className="suggestion-number">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Keywords Found */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge green">🔑</span>
          Keywords Detected
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {foundKeywords.length > 0 ? (
            foundKeywords.map((kw) => (
              <span key={kw} className="keyword-tag keyword-found">{kw}</span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No keywords matched yet.</p>
          )}
        </div>
      </div>

      {/* Keywords Missing */}
      <div className="glass-card p-6">
        <h3 className="section-title">
          <span className="icon-badge red">🔍</span>
          Missing Keywords
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-3">Consider adding these to boost your ATS score:</p>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.slice(0, 20).map((kw) => (
              <span key={kw} className="keyword-tag keyword-missing">{kw}</span>
            ))
          ) : (
            <p className="text-sm text-green-400">Great! No critical keywords missing.</p>
          )}
        </div>
      </div>

      {/* Sections */}
      {(sectionsFound.length > 0 || sectionsMissing.length > 0) && (
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="section-title">
            <span className="icon-badge blue">📋</span>
            Resume Sections
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Found</p>
              <div className="flex flex-wrap gap-2">
                {sectionsFound.map(s => (
                  <span key={s} className="keyword-tag keyword-found capitalize">{s}</span>
                ))}
              </div>
            </div>
            {sectionsMissing.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Missing (Core)</p>
                <div className="flex flex-wrap gap-2">
                  {sectionsMissing.map(s => (
                    <span key={s} className="keyword-tag keyword-missing capitalize">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
