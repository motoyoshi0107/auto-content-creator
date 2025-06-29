'use client'

import { useState } from 'react'
import ImportUrl from '@/components/ImportUrl'
import DraftInput from '@/components/DraftInput'
import GenerateButtons from '@/components/GenerateButtons'
import PreviewTabs from '@/components/PreviewTabs'

export default function HomePage() {
  const [draft, setDraft] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})
  const [importMessage, setImportMessage] = useState('')

  const handleImportSuccess = (title: string) => {
    setImportMessage(`「${title}」をインポートしました`)
    setTimeout(() => setImportMessage(''), 3000)
  }

  const handleGenerate = (format: string, content: string) => {
    setResults(prev => ({
      ...prev,
      [format]: content
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Auto Content Creator
          </h1>
          <p className="text-gray-600">
            URLインポート + AI生成でブログ・noteコンテンツ・Xポストを自動作成
          </p>
        </header>

        {/* Import success message */}
        {importMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {importMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ImportUrl onImportSuccess={handleImportSuccess} />
            <DraftInput draft={draft} onDraftChange={setDraft} />
            <GenerateButtons draft={draft} onGenerate={handleGenerate} />
          </div>

          {/* Right Column */}
          <div>
            <PreviewTabs results={results} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Gemini Flash & Supabase</p>
        </footer>
      </div>
    </div>
  )
}