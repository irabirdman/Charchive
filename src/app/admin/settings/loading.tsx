export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-10 bg-gray-700/50 rounded w-48 mb-2"></div>
        <div className="h-5 bg-gray-700/50 rounded w-96"></div>
      </div>

      {/* Setup section skeleton */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="h-8 bg-gray-700/50 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-96 mb-4"></div>
        <div className="h-10 bg-gray-700/50 rounded w-32"></div>
      </div>

      {/* Basic Information section skeleton */}
      <div>
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-4"></div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-700/50 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-700/50 rounded w-full"></div>
            </div>
          ))}
          <div className="h-12 bg-gray-700/50 rounded w-32"></div>
        </div>
      </div>

      {/* Homepage Customization section skeleton */}
      <div>
        <div className="h-8 bg-gray-700/50 rounded w-64 mb-4"></div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

