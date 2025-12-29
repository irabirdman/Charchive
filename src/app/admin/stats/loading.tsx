export default function AdminStatsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-10 bg-gray-700/50 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-700/50 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded w-40"></div>
      </div>

      {/* Overview Stats */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-40 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution Charts */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-6 bg-gray-700/50 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-4 bg-gray-700/50 rounded w-32"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-16"></div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Stats */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-56 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-12"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

