'use client'

import { useState } from 'react'

interface PreviewTabsProps {
  results: Record<string, string>
}

export default function PreviewTabs({ results }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(Object.keys(results)[0] || 'wordpress')

  const tabs = [
    { key: 'wordpress', label: 'WordPress' },
    { key: 'note', label: 'note' },
    { key: 'x', label: 'X (Twitter)' }
  ]

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const isOverLimit = (format: string, text: string) => {
    return format === 'x' && getCharacterCount(text) > 280
  }

  if (Object.keys(results).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">プレビュー</h2>
        <p className="text-gray-500">生成されたコンテンツがここに表示されます</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">プレビュー</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            disabled={!results[tab.key]}
          >
            {tab.label}
            {results[tab.key] && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                {getCharacterCount(results[tab.key])}文字
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab && results[activeTab] && (
        <div className="space-y-4">
          {/* Character count warning for X */}
          {activeTab === 'x' && (
            <div className={`text-sm ${
              isOverLimit(activeTab, results[activeTab]) 
                ? 'text-red-600 font-medium' 
                : 'text-gray-600'
            }`}>
              文字数: {getCharacterCount(results[activeTab])}/280
              {isOverLimit(activeTab, results[activeTab]) && ' (制限を超えています)'}
            </div>
          )}

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {results[activeTab]}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={() => navigator.clipboard.writeText(results[activeTab])}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            クリップボードにコピー
          </button>
        </div>
      )}
    </div>
  )
}