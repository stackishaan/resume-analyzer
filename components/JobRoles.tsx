'use client';

const ROLE_ICONS: Record<string, string> = {
  'Software Engineer': '⚙️',
  'Data Scientist': '📊',
  'Product Manager': '🗺️',
  'DevOps Engineer': '🛠️',
  'Frontend Developer': '🎨',
  'Backend Developer': '🔌',
  'ML Engineer': '🤖',
  'Technical Analyst': '🔍',
  'Software Developer': '💻',
  'Data Analyst': '📈',
  'Cloud Architect': '☁️',
  'Full Stack Developer': '🌐',
};

function getRoleIcon(role: string): string {
  for (const [key, icon] of Object.entries(ROLE_ICONS)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '💼';
}

const DEMAND_COLORS = [
  { bg: 'from-brand-500/20 to-brand-600/10', border: 'border-brand-500/30', badge: 'bg-brand-500/20 text-brand-300', rank: '🥇 Best Match' },
  { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300', rank: '🥈 Great Fit' },
  { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', badge: 'bg-cyan-500/20 text-cyan-300', rank: '🥉 Good Match' },
];

interface JobRolesProps {
  roles: string[];
}

export default function JobRoles({ roles }: JobRolesProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="section-title mb-5">
        <span className="icon-badge blue">🎯</span>
        Top 3 Best-Fit Job Roles
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roles.slice(0, 3).map((role, i) => {
          const colors = DEMAND_COLORS[i] || DEMAND_COLORS[2];
          return (
            <div
              key={i}
              className={`relative rounded-xl p-5 bg-gradient-to-br ${colors.bg} border ${colors.border} 
                          hover:scale-105 transition-transform duration-200 cursor-default group`}
            >
              {/* Rank badge */}
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge} mb-3`}>
                {colors.rank}
              </span>

              {/* Icon */}
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {getRoleIcon(role)}
              </div>

              {/* Role name */}
              <p className="text-white font-semibold text-sm leading-snug">{role}</p>

              {/* Decorative ring */}
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border border-white/5 opacity-50" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
