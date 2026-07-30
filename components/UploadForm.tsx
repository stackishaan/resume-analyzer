'use client';

import { useState, useRef, useCallback } from 'react';
import { COMPANIES, ROLES, Company, Role } from '@/lib/keywords';

interface UploadFormProps {
  onResult: (data: AnalysisResult) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export interface AnalysisResult {
  atsScore: number;
  breakdown: { label: string; score: number; maxScore: number }[];
  foundKeywords: string[];
  missingKeywords: string[];
  sectionsFound: string[];
  sectionsMissing: string[];
  wordCount: number;
  hasBullets: boolean;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  bestFitRoles: string[];
}

const COMPANY_LOGOS: Record<string, string> = {
  TCS: '🔵',
  Infosys: '🟢',
  Google: '🔴',
  Amazon: '🟠',
  Microsoft: '🟦',
  Accenture: '🟣',
};

export default function UploadForm({ onResult, onLoading, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [company, setCompany] = useState<Company>('Google');
  const [role, setRole] = useState<Role>('Software Engineer');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please upload a resume first.'); return; }

    setError(null);
    onLoading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('company', company);
      form.append('role', role);

      const res = await fetch('/api/analyze', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Analysis failed.');
      onResult(data as AnalysisResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drag-and-drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300
          ${isDragOver
            ? 'border-brand-400 bg-brand-500/10 scale-[1.02]'
            : file
              ? 'border-green-500/60 bg-green-500/5'
              : 'border-white/10 bg-white/2 hover:border-brand-400/60 hover:bg-brand-500/5'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="space-y-2 animate-fade-in">
            <div className="text-4xl">✅</div>
            <p className="text-green-400 font-semibold">{file.name}</p>
            <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(0)} KB • Click to change</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-5xl animate-pulse-slow">📄</div>
            <div>
              <p className="text-white font-semibold text-lg">
                {isDragOver ? 'Drop it here!' : 'Drop your resume here'}
              </p>
              <p className="text-slate-400 text-sm mt-1">or click to browse • PDF or DOCX • Max 5MB</p>
            </div>
          </div>
        )}

        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brand-400/40 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brand-400/40 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brand-400/40 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brand-400/40 rounded-br" />
      </div>

      {/* Company + Role selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">
            🏢 Target Company
          </label>
          <div className="relative">
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value as Company)}
              className="form-select"
            >
              {COMPANIES.map((c) => (
                <option key={c} value={c}>
                  {COMPANY_LOGOS[c]} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">
            💼 Target Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="form-select"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-fade-in">
          <span className="text-lg">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !file}
        className="submit-btn"
        id="analyze-btn"
      >
        {isLoading ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            <span>🚀</span>
            Analyze Resume
          </span>
        )}
      </button>
    </form>
  );
}
