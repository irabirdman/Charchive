export default function LoreLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex mb-4 gap-2">
          <div className="h-4 bg-gray-700/50 rounded w-16"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-32"></div>
      </div>

      {/* Filters skeleton */}
      <div className="wiki-card p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700/50 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-10 bg-gray-700/50 rounded"></div>
          <div className="h-10 bg-gray-700/50 rounded"></div>
          <div className="h-10 bg-gray-700/50 rounded"></div>
        </div>
      </div>

      {/* Lore entries skeleton - grouped by world */}
      <div className="space-y-8 animate-pulse">
        {[...Array(2)].map((_, worldIndex) => (
          <section key={worldIndex} className="space-y-4">
            {/* World header */}
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-700/50 rounded w-48"></div>
              <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            </div>
            
            {/* Lore cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, cardIndex) => (
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
          </section>
        ))}
      </div>
    </div>
  )
}

