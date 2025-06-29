'use client'

import { useState } from 'react'

interface ImportUrlProps {
  onImportSuccess: (title: string) => void
}

export default function ImportUrl({ onImportSuccess }: ImportUrlProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        onImportSuccess(data.title || 'インポート完了')
        setUrl('')
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('インポート中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleImport()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">URLインポート</h2>
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://example.com/article"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleImport}
          disabled={isLoading || !url.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '処理中...' : 'インポート'}
        </button>
      </div>
    </div>
  )
}