'use client'

import { useState } from 'react'

interface DraftInputProps {
  draft: string
  onDraftChange: (draft: string) => void
}

export default function DraftInput({ draft, onDraftChange }: DraftInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">下書き入力</h2>
      <textarea
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        placeholder="記事の下書きを入力してください..."
        className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <div className="mt-2 text-sm text-gray-500">
        文字数: {draft.length}
      </div>
    </div>
  )
}