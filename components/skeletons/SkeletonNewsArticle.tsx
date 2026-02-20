export default function SkeletonNewsArticle() {
  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container max-w-3xl">
        {/* Back Button */}
        <div className="mb-8 h-10 w-32 bg-gray-800 rounded animate-pulse"></div>

        {/* Article Container */}
        <article className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-96 bg-gray-700 animate-pulse"></div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Headline */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-4/5 bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 pb-8 border-b border-gray-700">
              <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Article Content */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Related Symbols */}
            <div className="pt-4 space-y-3">
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-16 bg-gray-700 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Original Article Link */}
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
