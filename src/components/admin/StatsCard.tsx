import Link from 'next/link';

interface StatsCardProps {
  title: string;
  count: number;
  href: string;
  color: string;
  icon: string;
}

export function StatsCard({ title, count, href, color, icon }: StatsCardProps) {
  return (
    <div className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
        <i className={`${icon} text-xl`} style={{ color }}></i>
      </div>
      <p className="text-3xl font-bold mb-3" style={{ color }}>
        {count}
      </p>
      <Link
        href={href}
        className="text-sm hover:underline inline-block"
        style={{ color }}
      >
        View All →
      </Link>
    </div>
  );
}




