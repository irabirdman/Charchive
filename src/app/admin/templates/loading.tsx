export default function TemplatesLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-10 bg-gray-700/50 rounded w-96 mb-2"></div>
          <div className="h-5 bg-gray-700/50 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-40"></div>
      </div>

      {/* Main content container */}
      <div className="bg-gray-800/40 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden p-6">
        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <div className="h-10 bg-gray-700/50 rounded-t w-32"></div>
          <div className="h-10 bg-gray-700/50 rounded-t w-32"></div>
        </div>

        {/* Content area */}
        <div className="space-y-6">
          {/* World selector skeleton */}
          <div className="h-10 bg-gray-700/50 rounded w-64"></div>

          {/* Template selector skeleton */}
          <div className="h-10 bg-gray-700/50 rounded w-64"></div>

          {/* Form fields skeleton */}
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                <div className="h-4 bg-gray-700/50 rounded w-32 mb-3"></div>
                <div className="h-10 bg-gray-700/50 rounded w-full"></div>
              </div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-4 pt-4">
            <div className="h-10 bg-gray-700/50 rounded w-32"></div>
            <div className="h-10 bg-gray-700/50 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

