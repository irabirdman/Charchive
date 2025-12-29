export default function SetupLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 animate-pulse">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="h-12 bg-gray-700/50 rounded w-64 mx-auto mb-4"></div>
          <div className="h-5 bg-gray-700/50 rounded w-96 mx-auto"></div>
        </div>

        {/* Form skeleton */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 space-y-6">
          {[...Array(9)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-700/50 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-700/50 rounded w-full"></div>
            </div>
          ))}
          
          {/* Submit button */}
          <div className="pt-4">
            <div className="h-12 bg-gray-700/50 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

