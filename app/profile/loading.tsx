export default function ProfileLoading() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
