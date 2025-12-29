export default function TimelinesLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex mb-4 gap-2">
          <div className="h-4 bg-gray-700/50 rounded w-16"></div>
          <div className="h-4 bg-gray-700/50 rounded w-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-40"></div>
      </div>

      {/* Timeline entries skeleton - grouped by world */}
      <div className="space-y-12 animate-pulse">
        {[...Array(2)].map((_, worldIndex) => (
          <section key={worldIndex}>
            {/* World header */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-700/50 rounded w-48"></div>
              <div className="h-4 bg-gray-700/50 rounded w-24"></div>
            </div>
            
            {/* Timeline cards */}
            <div className="space-y-4">
              {[...Array(3)].map((_, timelineIndex) => (
                <div key={timelineIndex} className="wiki-card wiki-card-hover p-6">
                  <div className="h-6 bg-gray-700/50 rounded w-64 mb-2"></div>
                  <div className="space-y-2">
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

