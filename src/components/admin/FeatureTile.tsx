import Link from 'next/link';

interface FeatureTileProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: 'purple' | 'pink' | 'blue' | 'teal' | 'orange' | 'indigo';
  count?: number;
  actionLabel?: string;
}

const colorClasses = {
  purple: 'bg-purple-600 hover:bg-purple-700 text-purple-400 border-purple-500/50',
  pink: 'bg-pink-600 hover:bg-pink-700 text-pink-400 border-pink-500/50',
  blue: 'bg-blue-600 hover:bg-blue-700 text-blue-400 border-blue-500/50',
  teal: 'bg-teal-600 hover:bg-teal-700 text-teal-400 border-teal-500/50',
  orange: 'bg-orange-600 hover:bg-orange-700 text-orange-400 border-orange-500/50',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-indigo-400 border-indigo-500/50',
};

export function FeatureTile({
  title,
  description,
  href,
  icon,
  color,
  count,
  actionLabel = 'Go →',
}: FeatureTileProps) {
  const colorClass = colorClasses[color] || colorClasses.purple; // Fallback to purple if color is invalid
  const textColorClass = colorClass.split(' ')[2] || 'text-purple-400'; // Extract text color class with fallback

  return (
    <Link
      href={href}
      prefetch={true}
      className="bg-gray-700/90 rounded-lg shadow-lg p-6 border border-gray-600/70 hover:scale-105 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <i className={`${icon} text-2xl ${textColorClass}`}></i>
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        {count !== undefined && (
          <span className={`text-sm font-bold ${textColorClass}`}>
            {count}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${textColorClass} group-hover:underline`}>
          {actionLabel}
        </span>
      </div>
    </Link>
  );
}


