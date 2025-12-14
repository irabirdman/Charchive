interface CardSkeletonProps {
  count?: number;
  columns?: number;
  showImage?: boolean;
  className?: string;
}

export function CardSkeleton({ 
  count = 6, 
  columns = 3,
  showImage = false,
  className = '' 
}: CardSkeletonProps) {
  const gridColsClass = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[columns] || 'lg:grid-cols-3'

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-700/90 rounded-lg shadow-lg border border-gray-600/70 overflow-hidden"
        >
          {showImage && (
            <div className="h-48 bg-gray-600"></div>
          )}
          <div className="p-4 space-y-2">
            <div className="h-5 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

