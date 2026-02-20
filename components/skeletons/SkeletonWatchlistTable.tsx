export default function SkeletonWatchlistTable() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-900">
            <th className="px-6 py-3 w-10"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr
              key={i}
              className="border-b border-gray-700 hover:bg-gray-700/50 transition"
            >
              <td className="px-6 py-4">
                <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-24 bg-gray-700 rounded-full animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
