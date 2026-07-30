'use client';

import { useEffect, useRef, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  animated?: boolean;
}

function getScoreColor(score: number): { stroke: string; glow: string; label: string; bg: string } {
  if (score >= 75) return { stroke: '#22c55e', glow: '#22c55e40', label: 'Excellent', bg: 'from-green-500/20' };
  if (score >= 55) return { stroke: '#f59e0b', glow: '#f59e0b40', label: 'Good', bg: 'from-amber-500/20' };
  if (score >= 35) return { stroke: '#f97316', glow: '#f9731640', label: 'Fair', bg: 'from-orange-500/20' };
  return { stroke: '#ef4444', glow: '#ef444440', label: 'Needs Work', bg: 'from-red-500/20' };
}

export default function ScoreGauge({ score, animated = true }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [strokeOffset, setStrokeOffset] = useState(339.29); // full circumference
  const animationRef = useRef<number | null>(null);

  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ≈ 339.29
  const targetOffset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setStrokeOffset(targetOffset);
      return;
    }

    let startTime: number | null = null;
    const duration = 1400;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayScore(Math.round(eased * score));
      setStrokeOffset(circumference - eased * (score / 100) * circumference);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [score, animated, circumference, targetOffset]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Gauge */}
      <div className="relative" style={{ width: 160, height: 160 }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
        />

        <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10 -rotate-90">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />

          {/* Score arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke})`,
              transition: animated ? 'none' : 'stroke-dashoffset 0.5s ease',
            }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = ((tick / 100) * circumference - circumference) / circumference * 360;
            const rad = (angle * Math.PI) / 180;
            const x1 = 80 + (radius - 8) * Math.cos(rad);
            const y1 = 80 + (radius - 8) * Math.sin(rad);
            const x2 = 80 + (radius + 2) * Math.cos(rad);
            const y2 = 80 + (radius + 2) * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="text-4xl font-black tabular-nums leading-none"
            style={{ color: colors.stroke, textShadow: `0 0 20px ${colors.glow}` }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{
            background: `${colors.glow}`,
            color: colors.stroke,
            border: `1px solid ${colors.stroke}40`,
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.stroke }} />
          {colors.label} ATS Match
        </div>
      </div>
    </div>
  );
}
