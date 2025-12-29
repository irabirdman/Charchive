export default function WorldLoreLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex mb-4 gap-2">
          <div className="h-4 bg-gray-700/50 rounded w-16"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-32"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-16"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-64"></div>
      </div>

      {/* Lore entries skeleton */}
      <div className="space-y-8 animate-pulse">
        <div className="space-y-4">
          {/* Lore cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, cardIndex) => (
              <div key={cardIndex} className="wiki-card wiki-card-hover overflow-hidden">
                <div className="h-48 bg-gray-700/50"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

