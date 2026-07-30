'use client';

export default function LoadingSpinner({ message = 'Analyzing your resume...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
      {/* Orbital spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-brand-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-purple-400 animate-spin"
             style={{ animationDuration: '0.7s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border-t-2 border-cyan-400 animate-spin"
             style={{ animationDuration: '0.5s' }} />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-brand-400 animate-pulse" />
        </div>
      </div>

      {/* Steps */}
      <div className="text-center space-y-1">
        <p className="text-white font-semibold text-lg">{message}</p>
        <p className="text-slate-400 text-sm">Parsing document • Scoring keywords • Generating AI insights</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
