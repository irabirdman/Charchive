'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  href?: string;
}

export function StatCard({ title, value, subtitle, color = '#ec4899', icon, href }: StatCardProps) {
  const content = (
    <div className="wiki-card p-6 text-center hover:scale-105 transition-transform h-full flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{title}</h3>
        {icon && <i className={`${icon} text-xl`} style={{ color }}></i>}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color }}>
          {value}
        </p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    );
  }

  return content;
}

