export default function StatsLoading() {
  return (
    <div className="space-y-8 md:space-y-12 animate-pulse">
      {/* Header */}
      <div className="text-center">
        <div className="h-12 bg-gray-700/50 rounded w-48 mx-auto mb-3"></div>
        <div className="h-6 bg-gray-700/50 rounded w-64 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700/50 rounded w-32 mx-auto"></div>
      </div>

      {/* Overview Stats */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-40 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700/50 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-700/50 rounded w-24"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Overview Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-12"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Demographics Section */}
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
                      <div className="h-4 bg-gray-700/50 rounded w-24"></div>
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

      {/* Age & Birthdays Section */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="h-6 bg-gray-700/50 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-16"></div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="h-6 bg-gray-700/50 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-4 bg-gray-700/50 rounded w-24"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-16"></div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media & Relationships Section */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-56 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-4 bg-gray-700/50 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-12 mb-1"></div>
              <div className="h-3 bg-gray-700/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution Charts Section */}
      <section>
        <div className="h-8 bg-gray-700/50 rounded w-56 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-6 bg-gray-700/50 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, j) => (
                  <div key={j}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-4 bg-gray-700/50 rounded w-32"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pie Chart Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="h-6 bg-gray-700/50 rounded w-40 mb-4"></div>
              <div className="h-64 bg-gray-700/50 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

