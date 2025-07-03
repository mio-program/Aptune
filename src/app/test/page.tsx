export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          テストページ
        </h1>
        <p className="text-gray-600">
          このページが正常に表示されれば、エラーハンドリングが正常に動作しています。
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            ✅ エラーなし - 正常に動作しています
          </p>
        </div>
      </div>
    </div>
  )
} 