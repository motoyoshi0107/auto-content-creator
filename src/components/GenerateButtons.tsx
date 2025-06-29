'use client'

import { useState } from 'react'

interface GenerateButtonsProps {
  draft: string
  onGenerate: (format: string, content: string) => void
}

export default function GenerateButtons({ draft, onGenerate }: GenerateButtonsProps) {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null)

  const handleGenerate = async (format: string) => {
    if (!draft.trim()) {
      alert('下書きを入力してください')
      return
    }

    setLoadingFormat(format)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: draft.trim(), format })
      })

      const data = await response.json()

      if (response.ok) {
        onGenerate(format, data.text)
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error('Generate error:', error)
      alert('生成中にエラーが発生しました')
    } finally {
      setLoadingFormat(null)
    }
  }

  const formats = [
    { key: 'wordpress', label: 'WordPress', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'note', label: 'note', color: 'bg-green-600 hover:bg-green-700' },
    { key: 'x', label: 'X (Twitter)', color: 'bg-black hover:bg-gray-800' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">コンテンツ生成</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((format) => (
          <button
            key={format.key}
            onClick={() => handleGenerate(format.key)}
            disabled={loadingFormat !== null || !draft.trim()}
            className={`px-6 py-3 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${format.color}`}
          >
            {loadingFormat === format.key ? '生成中...' : format.label}
          </button>
        ))}
      </div>
    </div>
  )
}