export default function LoreDetailLoading() {
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
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-64"></div>
      </div>

      <div className="space-y-6 animate-pulse">
        {/* Banner image skeleton */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-700/50 rounded-lg"></div>

        {/* Header card skeleton */}
        <div className="wiki-card p-6">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="h-6 bg-gray-700/50 rounded w-24"></div>
            <div className="h-4 bg-gray-700/50 rounded w-32"></div>
            <div className="h-4 bg-gray-700/50 rounded w-40"></div>
          </div>
          <div className="h-10 bg-gray-700/50 rounded w-64"></div>
        </div>

        {/* Description skeleton */}
        <div className="wiki-card p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/5"></div>
          </div>
        </div>

        {/* Details section skeleton */}
        <div className="wiki-card p-6">
          <div className="h-8 bg-gray-700/50 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/5"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          </div>
        </div>

        {/* Related sections skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="wiki-card p-6">
            <div className="h-8 bg-gray-700/50 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-700/50 rounded w-32"></div>
              ))}
            </div>
          </div>
          <div className="wiki-card p-6">
            <div className="h-8 bg-gray-700/50 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-700/50 rounded w-40"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Infobox skeleton */}
        <div className="wiki-infobox">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
                <div className="h-5 bg-gray-700/50 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

